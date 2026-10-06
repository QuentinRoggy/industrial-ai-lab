import BigFactory, { type Big as BigValue } from 'big.js'

/**
 * Private constructor so global big.js settings changed elsewhere cannot
 * alter the arithmetic used for quantities and money.
 */
const Big = BigFactory()

/**
 * Exact decimal number for quantities and money. Never use a JavaScript
 * number for these values.
 */
export class Decimal {
  private constructor(private readonly value: BigValue) {}

  static of(value: string): Decimal {
    try {
      return new Decimal(new Big(value))
    } catch {
      throw new Error(`Invalid decimal value "${value}"`)
    }
  }

  plus(other: Decimal): Decimal {
    return new Decimal(this.value.plus(other.value))
  }

  minus(other: Decimal): Decimal {
    return new Decimal(this.value.minus(other.value))
  }

  times(other: Decimal): Decimal {
    return new Decimal(this.value.times(other.value))
  }

  equals(other: Decimal): boolean {
    return this.value.eq(other.value)
  }

  lessThan(other: Decimal): boolean {
    return this.value.lt(other.value)
  }

  greaterThan(other: Decimal): boolean {
    return this.value.gt(other.value)
  }

  isNegative(): boolean {
    return this.value.lt(0)
  }

  toString(): string {
    return this.value.toFixed()
  }
}
