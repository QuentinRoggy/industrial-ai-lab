import type { Outbox } from '#shared/application/outbox'
import type { Transaction } from '#shared/application/unit_of_work'
import type { DomainEvent } from '#shared/domain/domain_event'
import { generateId } from '#shared/domain/identifier'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import db from '@adonisjs/lucid/services/db'

const table = 'outbox_messages'

export interface OutboxMessage extends DomainEvent {
  id: string
}

export class LucidOutbox implements Outbox {
  async record(transaction: Transaction, event: DomainEvent): Promise<void> {
    await lucidClient(transaction)
      .table(table)
      .insert({
        id: generateId(),
        name: event.name,
        version: event.version,
        occurred_at: event.occurredAt,
        payload: JSON.stringify(event.payload),
      })
  }

  /**
   * Messages not yet published, oldest first.
   */
  async pending(): Promise<OutboxMessage[]> {
    const rows = await db
      .from(table)
      .whereNull('published_at')
      .orderBy('position', 'asc')
      .select('id', 'name', 'version', 'occurred_at', 'payload')

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      version: row.version,
      occurredAt: row.occurred_at,
      payload: row.payload,
    }))
  }
}
