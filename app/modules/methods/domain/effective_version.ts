import type { DefinitionStatus } from '#modules/methods/domain/routing_version'
import type { CalendarDate } from '#shared/domain/calendar_date'

interface VersionInEffect {
  status: DefinitionStatus
  effectiveFrom: CalendarDate | null
  obsoleteFrom: CalendarDate | null
}

/**
 * The version in effect at a date: among versions ever approved, the one with
 * the latest effective date on or before it. If that version became obsolete
 * on or before the date, nothing applies; the version it replaced never comes
 * back, so past answers never change.
 */
export function effectiveVersionAt<T extends VersionInEffect>(
  versions: readonly T[],
  date: CalendarDate
): T | null {
  let latest: T | null = null

  for (const version of versions) {
    const from = version.effectiveFrom
    if (version.status === 'draft' || !from || from.isAfter(date)) continue
    if (!latest?.effectiveFrom || from.isAfter(latest.effectiveFrom)) {
      latest = version
    }
  }

  if (latest?.obsoleteFrom && !latest.obsoleteFrom.isAfter(date)) {
    return null
  }
  return latest
}
