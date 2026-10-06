import type { Transaction } from '#shared/application/unit_of_work'
import type { DomainEvent } from '#shared/domain/domain_event'

/**
 * Records domain events in the same transaction as the state change that
 * produced them.
 */
export interface Outbox {
  record(transaction: Transaction, event: DomainEvent): Promise<void>
}
