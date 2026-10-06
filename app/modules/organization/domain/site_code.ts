import { DomainError } from '#shared/domain/domain_error'

const pattern = /^[A-Z0-9][A-Z0-9_-]{0,19}$/

export class SiteCode {
  private constructor(private readonly value: string) {}

  static of(value: string): SiteCode {
    const normalised = value.trim().toUpperCase()

    if (!pattern.test(normalised)) {
      throw new DomainError('organization.invalid_site_code', `Invalid site code "${value}"`)
    }

    return new SiteCode(normalised)
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
