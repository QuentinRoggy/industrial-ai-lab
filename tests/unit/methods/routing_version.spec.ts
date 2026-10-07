import { RoutingVersion, type OperationDefinition } from '#modules/methods/domain/routing_version'
import { CalendarDate } from '#shared/domain/calendar_date'
import { Decimal } from '#shared/domain/decimal'
import { test } from '@japa/runner'

const valveBodyId = '6f1c2a5e-1d2b-4c3a-9e8f-7a6b5c4d3e2f'
const latheId = '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d'
const today = CalendarDate.of('2026-03-02')

const turning: OperationDefinition = {
  sequence: 10,
  workCentreId: latheId,
  setupMinutes: Decimal.of('30'),
  runMinutesPerUnit: Decimal.of('4.5'),
}

test.group('RoutingVersion', () => {
  test('a draft can be revised, an approved version cannot', ({ assert }) => {
    const routing = RoutingVersion.draft(valveBodyId, 1, [turning])
    const drilling = { ...turning, sequence: 20, runMinutesPerUnit: Decimal.of('2') }

    routing.revise([turning, drilling])
    assert.deepEqual(
      routing.operations.map((operation) => operation.sequence),
      [10, 20]
    )

    routing.approve(CalendarDate.of('2026-03-10'), { today, latestApproved: null })
    assert.equal(routing.status, 'approved')
    assert.throws(() => routing.revise([turning]), 'Only a draft routing can be revised')
  })

  test('is approved from today or later, after the latest approved version', ({ assert }) => {
    const approve = (effectiveFrom: string, latestApproved: string | null) =>
      RoutingVersion.draft(valveBodyId, 2, [turning]).approve(CalendarDate.of(effectiveFrom), {
        today,
        latestApproved: latestApproved ? CalendarDate.of(latestApproved) : null,
      })

    assert.throws(() => approve('2026-03-01', null), 'A routing cannot take effect in the past')
    assert.throws(
      () => approve('2026-03-10', '2026-03-10'),
      'A routing must take effect after the latest approved version (2026-03-10)'
    )
    assert.doesNotThrow(() => approve('2026-03-02', '2026-02-01'))
  })

  test('only a draft is approved and only an approved version becomes obsolete', ({ assert }) => {
    const routing = RoutingVersion.draft(valveBodyId, 1, [turning])

    assert.throws(() => routing.makeObsolete(today), 'Only an approved routing can become obsolete')
    routing.approve(today, { today, latestApproved: null })
    assert.throws(
      () => routing.approve(today, { today, latestApproved: null }),
      'Only a draft routing can be approved'
    )
    routing.makeObsolete(CalendarDate.of('2026-03-20'))
    assert.equal(routing.status, 'obsolete')
    assert.equal(routing.obsoleteFrom?.toString(), '2026-03-20')
  })

  test('has at least one operation, unique sequences in order, and non-negative times', ({
    assert,
  }) => {
    assert.throws(
      () => RoutingVersion.draft(valveBodyId, 1, []),
      'A routing needs at least one operation'
    )
    assert.throws(
      () => RoutingVersion.draft(valveBodyId, 1, [turning, turning]),
      'Operation sequence 10 is used twice'
    )
    assert.throws(
      () => RoutingVersion.draft(valveBodyId, 1, [{ ...turning, setupMinutes: Decimal.of('-1') }]),
      'Operation 10 has a negative time'
    )

    const routing = RoutingVersion.draft(valveBodyId, 1, [{ ...turning, sequence: 20 }, turning])
    assert.deepEqual(
      routing.operations.map((operation) => operation.sequence),
      [10, 20]
    )
  })
})
