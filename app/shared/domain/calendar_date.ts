import { DomainError } from '#shared/domain/domain_error'

const pattern = /^\d{4}-\d{2}-\d{2}$/

/**
 * A day without time or time zone, such as an effective date or a due date.
 */
export class CalendarDate {
  private constructor(private readonly value: string) {}

  static of(value: string): CalendarDate {
    const parsed = new Date(`${value}T00:00:00.000Z`)

    if (!pattern.test(value) || Number.isNaN(parsed.getTime())) {
      throw new DomainError('shared.invalid_date', `Invalid date "${value}"`)
    }
    if (parsed.toISOString().slice(0, 10) !== value) {
      throw new DomainError('shared.invalid_date', `Invalid date "${value}"`)
    }

    return new CalendarDate(value)
  }

  /**
   * The UTC day of an instant.
   */
  static fromInstant(instant: Date): CalendarDate {
    return new CalendarDate(instant.toISOString().slice(0, 10))
  }

  isBefore(other: CalendarDate): boolean {
    return this.value < other.value
  }

  isAfter(other: CalendarDate): boolean {
    return this.value > other.value
  }

  equals(other: CalendarDate): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
