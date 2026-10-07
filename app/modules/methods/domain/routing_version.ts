import type { CalendarDate } from '#shared/domain/calendar_date'
import type { Decimal } from '#shared/domain/decimal'
import { DomainError } from '#shared/domain/domain_error'
import { generateId } from '#shared/domain/identifier'

export type DefinitionStatus = 'draft' | 'approved' | 'obsolete'

export interface OperationDefinition {
  sequence: number
  workCentreId: string
  setupMinutes: Decimal
  runMinutesPerUnit: Decimal
}

export class RoutingVersion {
  private constructor(
    readonly id: string,
    readonly itemId: string,
    readonly number: number,
    private currentStatus: DefinitionStatus,
    private currentEffectiveFrom: CalendarDate | null,
    private currentObsoleteFrom: CalendarDate | null,
    private currentOperations: OperationDefinition[],
    readonly persistedVersion: number
  ) {}

  static draft(itemId: string, number: number, operations: OperationDefinition[]): RoutingVersion {
    return new RoutingVersion(
      generateId(),
      itemId,
      number,
      'draft',
      null,
      null,
      validatedOperations(operations),
      1
    )
  }

  static restore(state: {
    id: string
    itemId: string
    number: number
    status: DefinitionStatus
    effectiveFrom: CalendarDate | null
    obsoleteFrom: CalendarDate | null
    operations: OperationDefinition[]
    persistedVersion: number
  }): RoutingVersion {
    return new RoutingVersion(
      state.id,
      state.itemId,
      state.number,
      state.status,
      state.effectiveFrom,
      state.obsoleteFrom,
      state.operations,
      state.persistedVersion
    )
  }

  get status(): DefinitionStatus {
    return this.currentStatus
  }

  get effectiveFrom(): CalendarDate | null {
    return this.currentEffectiveFrom
  }

  get obsoleteFrom(): CalendarDate | null {
    return this.currentObsoleteFrom
  }

  get operations(): readonly OperationDefinition[] {
    return this.currentOperations
  }

  revise(operations: OperationDefinition[]): void {
    if (this.currentStatus !== 'draft') {
      throw new DomainError('methods.routing_not_draft', 'Only a draft routing can be revised')
    }
    this.currentOperations = validatedOperations(operations)
  }

  /**
   * A newly approved version replaces the previous one from its effective
   * date. To keep history intact, that date is never in the past and always
   * after the latest approved version's.
   */
  approve(
    effectiveFrom: CalendarDate,
    context: { today: CalendarDate; latestApproved: CalendarDate | null }
  ): void {
    if (this.currentStatus !== 'draft') {
      throw new DomainError('methods.routing_not_draft', 'Only a draft routing can be approved')
    }
    if (effectiveFrom.isBefore(context.today)) {
      throw new DomainError(
        'methods.retroactive_routing',
        'A routing cannot take effect in the past'
      )
    }
    if (context.latestApproved && !effectiveFrom.isAfter(context.latestApproved)) {
      throw new DomainError(
        'methods.overlapping_routing',
        `A routing must take effect after the latest approved version (${context.latestApproved.toString()})`
      )
    }

    this.currentStatus = 'approved'
    this.currentEffectiveFrom = effectiveFrom
  }

  /**
   * Stops the version from applying on and after a date. Its past stays as it
   * was, and the version it replaced does not come back.
   */
  makeObsolete(from: CalendarDate): void {
    if (this.currentStatus !== 'approved') {
      throw new DomainError(
        'methods.routing_not_approved',
        'Only an approved routing can become obsolete'
      )
    }
    this.currentStatus = 'obsolete'
    this.currentObsoleteFrom = from
  }
}

function validatedOperations(operations: OperationDefinition[]): OperationDefinition[] {
  if (operations.length === 0) {
    throw new DomainError(
      'methods.routing_without_operation',
      'A routing needs at least one operation'
    )
  }

  const sequences = new Set<number>()
  for (const operation of operations) {
    if (sequences.has(operation.sequence)) {
      throw new DomainError(
        'methods.duplicate_operation_sequence',
        `Operation sequence ${operation.sequence} is used twice`
      )
    }
    sequences.add(operation.sequence)

    if (operation.setupMinutes.isNegative() || operation.runMinutesPerUnit.isNegative()) {
      throw new DomainError(
        'methods.negative_operation_time',
        `Operation ${operation.sequence} has a negative time`
      )
    }
  }

  return [...operations].sort((a, b) => a.sequence - b.sequence)
}
