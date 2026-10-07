import { effectiveVersionAt } from '#modules/methods/domain/effective_version'
import type { DefinitionStatus } from '#modules/methods/domain/routing_version'
import { CalendarDate } from '#shared/domain/calendar_date'
import { test } from '@japa/runner'

function version(
  number: number,
  status: DefinitionStatus,
  effectiveFrom: string | null,
  obsoleteFrom: string | null = null
) {
  return {
    number,
    status,
    effectiveFrom: effectiveFrom ? CalendarDate.of(effectiveFrom) : null,
    obsoleteFrom: obsoleteFrom ? CalendarDate.of(obsoleteFrom) : null,
  }
}

const numberAt = (versions: ReturnType<typeof version>[], date: string) =>
  effectiveVersionAt(versions, CalendarDate.of(date))?.number ?? null

test.group('effectiveVersionAt', () => {
  test('returns the latest approved version already in effect at the date', ({ assert }) => {
    const versions = [
      version(1, 'approved', '2026-03-10'),
      version(2, 'approved', '2026-04-01'),
      version(3, 'draft', null),
    ]

    assert.isNull(numberAt(versions, '2026-03-09'))
    assert.equal(numberAt(versions, '2026-03-10'), 1)
    assert.equal(numberAt(versions, '2026-03-31'), 1)
    assert.equal(numberAt(versions, '2026-04-01'), 2)
    assert.equal(numberAt(versions, '2026-06-01'), 2)
  })

  test('an obsolete version keeps its past and never revives the version it replaced', ({
    assert,
  }) => {
    const versions = [
      version(1, 'approved', '2026-03-10'),
      version(2, 'obsolete', '2026-04-01', '2026-05-01'),
    ]

    assert.equal(numberAt(versions, '2026-03-31'), 1)
    assert.equal(numberAt(versions, '2026-04-15'), 2)
    assert.isNull(numberAt(versions, '2026-05-01'))
    assert.isNull(numberAt(versions, '2026-06-01'))
  })
})
