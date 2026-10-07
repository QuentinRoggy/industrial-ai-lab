import { parseCode } from '#shared/domain/code'
import { DomainError } from '#shared/domain/domain_error'

export class ItemCode {
  private constructor(private readonly value: string) {}

  static of(value: string): ItemCode {
    return new ItemCode(
      parseCode(value, {
        maxLength: 40,
        invalid: () => new DomainError('catalog.invalid_item_code', `Invalid item code "${value}"`),
      })
    )
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
