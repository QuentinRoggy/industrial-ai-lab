/**
 * Source of the current instant for business code. Phase 2 replaces the
 * system clock with a virtual one, so never call `new Date()` directly.
 */
export interface Clock {
  now(): Date
}

export class FixedClock implements Clock {
  constructor(private readonly instant: Date) {}

  now(): Date {
    return new Date(this.instant)
  }
}
