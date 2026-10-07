import { parseCode } from '#shared/domain/code'
import { DomainError } from '#shared/domain/domain_error'

export class SiteCode {
  private constructor(private readonly value: string) {}

  static of(value: string): SiteCode {
    return new SiteCode(
      parseCode(value, {
        maxLength: 20,
        invalid: () =>
          new DomainError('organization.invalid_site_code', `Invalid site code "${value}"`),
      })
    )
  }

  toString(): string {
    return this.value
  }
}

export function duplicateSiteCode(code: SiteCode): DomainError {
  return new DomainError(
    'organization.duplicate_site_code',
    `Site code "${code.toString()}" is already used`
  )
}
