import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { ItemLookup } from '#modules/methods/application/item_lookup'
import type { RoutingRepository } from '#modules/methods/domain/routing_repository'
import { RoutingVersion, type OperationDefinition } from '#modules/methods/domain/routing_version'
import type { WorkCentreRepository } from '#modules/methods/domain/work_centre_repository'
import type { Outbox } from '#shared/application/outbox'
import type { Transaction, UnitOfWork } from '#shared/application/unit_of_work'
import { CalendarDate } from '#shared/domain/calendar_date'
import type { Clock } from '#shared/domain/clock'
import { Decimal } from '#shared/domain/decimal'
import { DomainError } from '#shared/domain/domain_error'

export interface OperationInput {
  sequence: number
  workCentreId: string
  setupMinutes: string
  runMinutesPerUnit: string
}

export interface RoutingDependencies {
  accessControl: AccessControl
  unitOfWork: UnitOfWork
  routings: RoutingRepository
  workCentres: WorkCentreRepository
  items: ItemLookup
  outbox: Outbox
  clock: Clock
}

/**
 * Shared steps of the routing use cases: loading a routing and turning
 * operation inputs into checked operation definitions.
 */
abstract class RoutingCommand {
  constructor(protected readonly deps: RoutingDependencies) {}

  protected async operations(
    transaction: Transaction,
    inputs: OperationInput[]
  ): Promise<OperationDefinition[]> {
    const missing = await this.deps.workCentres.missingIds(
      transaction,
      inputs.map((input) => input.workCentreId)
    )
    if (missing.length > 0) {
      throw new DomainError(
        'methods.unknown_work_centre',
        `Unknown work centre ${missing.join(', ')}`
      )
    }

    return inputs.map((input) => ({
      sequence: input.sequence,
      workCentreId: input.workCentreId,
      setupMinutes: Decimal.of(input.setupMinutes),
      runMinutesPerUnit: Decimal.of(input.runMinutesPerUnit),
    }))
  }

  protected async load(transaction: Transaction, routingId: string): Promise<RoutingVersion> {
    const routing = await this.deps.routings.get(transaction, routingId)
    if (!routing) {
      throw new DomainError('methods.unknown_routing', `Unknown routing ${routingId}`)
    }
    return routing
  }
}

export class DraftRouting extends RoutingCommand {
  async execute(actor: Actor, input: { itemId: string; operations: OperationInput[] }) {
    await this.deps.accessControl.ensure(actor, 'methods.draft_routing')

    return this.deps.unitOfWork.run(async (transaction) => {
      const item = await this.deps.items.findById(input.itemId)
      if (!item?.manufactured) {
        throw new DomainError(
          'methods.routing_for_non_manufactured_item',
          'Only a manufactured item can have a routing'
        )
      }

      const routing = RoutingVersion.draft(
        input.itemId,
        await this.deps.routings.nextNumber(transaction, input.itemId),
        await this.operations(transaction, input.operations)
      )
      await this.deps.routings.add(transaction, routing, this.deps.clock.now())

      return { id: routing.id, number: routing.number }
    })
  }
}

export class ReviseRouting extends RoutingCommand {
  async execute(actor: Actor, input: { routingId: string; operations: OperationInput[] }) {
    await this.deps.accessControl.ensure(actor, 'methods.revise_routing')

    await this.deps.unitOfWork.run(async (transaction) => {
      const routing = await this.load(transaction, input.routingId)
      routing.revise(await this.operations(transaction, input.operations))
      await this.deps.routings.save(transaction, routing)
    })
  }
}

export class ApproveRouting extends RoutingCommand {
  async execute(actor: Actor, input: { routingId: string; effectiveFrom: string }) {
    await this.deps.accessControl.ensure(actor, 'methods.approve_routing')

    await this.deps.unitOfWork.run(async (transaction) => {
      const routing = await this.load(transaction, input.routingId)
      const now = this.deps.clock.now()

      routing.approve(CalendarDate.of(input.effectiveFrom), {
        today: CalendarDate.fromInstant(now),
        latestApproved: await this.deps.routings.latestEffectiveFromForUpdate(
          transaction,
          routing.itemId
        ),
      })
      await this.deps.routings.save(transaction, routing)
      await this.deps.outbox.record(transaction, {
        name: 'methods.routing_approved',
        version: 1,
        occurredAt: now,
        payload: {
          routingId: routing.id,
          itemId: routing.itemId,
          effectiveFrom: input.effectiveFrom,
        },
      })
    })
  }
}

export class MakeRoutingObsolete extends RoutingCommand {
  async execute(actor: Actor, input: { routingId: string }) {
    await this.deps.accessControl.ensure(actor, 'methods.make_routing_obsolete')

    await this.deps.unitOfWork.run(async (transaction) => {
      const routing = await this.load(transaction, input.routingId)
      routing.makeObsolete(CalendarDate.fromInstant(this.deps.clock.now()))
      await this.deps.routings.save(transaction, routing)
    })
  }
}
