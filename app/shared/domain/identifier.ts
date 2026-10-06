import { randomUUID } from 'node:crypto'

/**
 * Aggregates get their identity from the application, before persistence.
 */
export function generateId(): string {
  return randomUUID()
}
