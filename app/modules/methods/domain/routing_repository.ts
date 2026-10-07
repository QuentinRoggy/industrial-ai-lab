import type { RoutingVersion } from '#modules/methods/domain/routing_version'
import type { Transaction } from '#shared/application/unit_of_work'
import type { CalendarDate } from '#shared/domain/calendar_date'

export interface RoutingRepository {
  get(transaction: Transaction, id: string): Promise<RoutingVersion | null>
  nextNumber(transaction: Transaction, itemId: string): Promise<number>
  /**
   * The latest effective date of any version ever approved for the item. Locks
   * the item's versions until the transaction ends, so approvals run one at a
   * time.
   */
  latestEffectiveFromForUpdate(
    transaction: Transaction,
    itemId: string
  ): Promise<CalendarDate | null>
  add(transaction: Transaction, routing: RoutingVersion, createdAt: Date): Promise<void>
  /**
   * Saves changes, refusing them if another transaction saved first.
   */
  save(transaction: Transaction, routing: RoutingVersion): Promise<void>
}
