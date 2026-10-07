import type { DomainError } from '#shared/domain/domain_error'

/**
 * Normalises a business code to trimmed upper case and checks it: letters,
 * digits, dot, dash, or underscore, starting with a letter or digit.
 */
export function parseCode(
  value: string,
  { maxLength, invalid }: { maxLength: number; invalid: () => DomainError }
): string {
  const normalised = value.trim().toUpperCase()
  const pattern = new RegExp(`^[A-Z0-9][A-Z0-9._-]{0,${maxLength - 1}}$`)

  if (!pattern.test(normalised)) {
    throw invalid()
  }

  return normalised
}
