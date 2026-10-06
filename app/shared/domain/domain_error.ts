/**
 * A business rule refused the operation. `code` is stable and machine
 * readable; the message is for people.
 */
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'DomainError'
  }
}
