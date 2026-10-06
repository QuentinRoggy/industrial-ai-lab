/**
 * Whether a database error is a PostgreSQL unique constraint violation.
 */
export function isUniqueViolation(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === '23505'
}
