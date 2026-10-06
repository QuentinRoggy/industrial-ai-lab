import { DomainError } from '#shared/domain/domain_error'

const pattern = /^[A-Z0-9][A-Z0-9._-]{0,39}$/

export class ItemCode {
  private constructor(private readonly value: string) {}

  static of(value: string): ItemCode {
    const normalised = value.trim().toUpperCase()

    if (!pattern.test(normalised)) {
      throw new DomainError('catalog.invalid_item_code', `Invalid item code "${value}"`)
    }

    return new ItemCode(normalised)
  }

  toString(): string {
    return this.value
  }
}

export function duplicateItemCode(code: ItemCode): DomainError {
  return new DomainError(
    'catalog.duplicate_item_code',
    `Item code "${code.toString()}" is already used`
  )
}
