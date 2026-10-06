import { FixedClock } from '#shared/domain/clock'
import { test } from '@japa/runner'

test.group('FixedClock', () => {
  test('always returns the instant it was set to', ({ assert }) => {
    const clock = new FixedClock(new Date('2026-03-02T08:00:00.000Z'))

    const first = clock.now()
    first.setUTCFullYear(1999)

    assert.equal(clock.now().toISOString(), '2026-03-02T08:00:00.000Z')
  })
})
