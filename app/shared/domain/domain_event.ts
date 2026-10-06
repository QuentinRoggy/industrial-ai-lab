/**
 * A fact that happened in a module. Names use past tense, for example
 * `inventory.stock_movement_created`. Payloads carry identifiers, never ORM
 * objects, and change only through a new version.
 */
export interface DomainEvent {
  readonly name: string
  readonly version: number
  readonly occurredAt: Date
  readonly payload: Readonly<Record<string, unknown>>
}
