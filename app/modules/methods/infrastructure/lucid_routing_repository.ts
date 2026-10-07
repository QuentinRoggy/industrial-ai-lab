import type { RoutingRepository } from '#modules/methods/domain/routing_repository'
import { RoutingVersion } from '#modules/methods/domain/routing_version'
import type { Transaction } from '#shared/application/unit_of_work'
import { CalendarDate } from '#shared/domain/calendar_date'
import { Decimal } from '#shared/domain/decimal'
import { DomainError } from '#shared/domain/domain_error'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import { isUniqueViolation } from '#shared/infrastructure/unique_violation'

const versions = 'routing_versions'
const operations = 'routing_operations'

export class LucidRoutingRepository implements RoutingRepository {
  async get(transaction: Transaction, id: string): Promise<RoutingVersion | null> {
    const client = lucidClient(transaction)
    const row = await client.from(versions).where('id', id).first()
    if (!row) return null

    const operationRows = await client
      .from(operations)
      .where('routing_version_id', id)
      .orderBy('sequence')

    return RoutingVersion.restore({
      id: row.id,
      itemId: row.item_id,
      number: row.number,
      status: row.status,
      effectiveFrom: optionalDate(row.effective_from),
      obsoleteFrom: optionalDate(row.obsolete_from),
      persistedVersion: row.version,
      operations: operationRows.map((operation) => ({
        sequence: operation.sequence,
        workCentreId: operation.work_centre_id,
        setupMinutes: Decimal.of(operation.setup_minutes),
        runMinutesPerUnit: Decimal.of(operation.run_minutes_per_unit),
      })),
    })
  }

  async nextNumber(transaction: Transaction, itemId: string): Promise<number> {
    const row = await lucidClient(transaction)
      .from(versions)
      .where('item_id', itemId)
      .max('number as latest')
      .first()
    return (row?.latest ?? 0) + 1
  }

  async latestEffectiveFromForUpdate(
    transaction: Transaction,
    itemId: string
  ): Promise<CalendarDate | null> {
    const rows = await lucidClient(transaction)
      .from(versions)
      .where('item_id', itemId)
      .forUpdate()
      .select('effective_from')

    const dates = rows.map((row) => row.effective_from).filter((date): date is string => !!date)
    return dates.length > 0 ? CalendarDate.of(dates.sort().at(-1)!) : null
  }

  async add(transaction: Transaction, routing: RoutingVersion, createdAt: Date): Promise<void> {
    try {
      await lucidClient(transaction)
        .table(versions)
        .insert({
          id: routing.id,
          item_id: routing.itemId,
          number: routing.number,
          status: routing.status,
          effective_from: routing.effectiveFrom?.toString() ?? null,
          obsolete_from: routing.obsoleteFrom?.toString() ?? null,
          version: routing.persistedVersion,
          created_at: createdAt,
        })
    } catch (error) {
      if (isUniqueViolation(error)) throw changedConcurrently(routing)
      throw error
    }
    await this.insertOperations(transaction, routing)
  }

  async save(transaction: Transaction, routing: RoutingVersion): Promise<void> {
    const client = lucidClient(transaction)
    const current = await client.from(versions).where('id', routing.id).first()
    const updated = await client
      .from(versions)
      .where({ id: routing.id, version: routing.persistedVersion })
      .update({
        status: routing.status,
        effective_from: routing.effectiveFrom?.toString() ?? null,
        obsolete_from: routing.obsoleteFrom?.toString() ?? null,
        version: routing.persistedVersion + 1,
      })

    if (Number(updated) !== 1) {
      throw changedConcurrently(routing)
    }

    // Operations of an approved or obsolete version are never rewritten.
    if (current?.status === 'draft') {
      await client.from(operations).where('routing_version_id', routing.id).delete()
      await this.insertOperations(transaction, routing)
    }
  }

  private async insertOperations(transaction: Transaction, routing: RoutingVersion) {
    await lucidClient(transaction)
      .table(operations)
      .multiInsert(
        routing.operations.map((operation) => ({
          routing_version_id: routing.id,
          sequence: operation.sequence,
          work_centre_id: operation.workCentreId,
          setup_minutes: operation.setupMinutes.toString(),
          run_minutes_per_unit: operation.runMinutesPerUnit.toString(),
        }))
      )
  }
}

function optionalDate(value: string | null): CalendarDate | null {
  return value ? CalendarDate.of(value) : null
}

function changedConcurrently(routing: RoutingVersion): DomainError {
  return new DomainError(
    'methods.routing_changed_concurrently',
    `Routing ${routing.id} was changed by someone else`
  )
}
