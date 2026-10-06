import type { SiteCode } from '#modules/organization/domain/site_code'
import { DomainError } from '#shared/domain/domain_error'
import { generateId } from '#shared/domain/identifier'

export class Site {
  private constructor(
    readonly id: string,
    readonly organizationId: string,
    readonly code: SiteCode,
    readonly name: string
  ) {}

  static create(organizationId: string, code: SiteCode, name: string): Site {
    const trimmed = name.trim()

    if (trimmed === '') {
      throw new DomainError('organization.invalid_site_name', 'A site needs a name')
    }

    return new Site(generateId(), organizationId, code, trimmed)
  }
}
