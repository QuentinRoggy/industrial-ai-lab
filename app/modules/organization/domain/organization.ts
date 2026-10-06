import { DomainError } from '#shared/domain/domain_error'
import { generateId } from '#shared/domain/identifier'

export class Organization {
  private constructor(
    readonly id: string,
    readonly name: string
  ) {}

  static create(name: string): Organization {
    const trimmed = name.trim()

    if (trimmed === '') {
      throw new DomainError('organization.invalid_name', 'An organization needs a name')
    }

    return new Organization(generateId(), trimmed)
  }

  static restore(id: string, name: string): Organization {
    return new Organization(id, name)
  }
}
