import { LucidOutbox } from '#shared/infrastructure/lucid_outbox'
import { LucidUnitOfWork, lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

const somethingHappened = {
  name: 'test.something_happened',
  version: 1,
  occurredAt: new Date('2026-03-02T08:00:00.000Z'),
  payload: { thingId: '0b6f4f8e-3c3a-4d8e-9a55-2f7c1f0f4a10' },
}

test.group('Unit of work', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  group.each.setup(async () => {
    await db.rawQuery('create temporary table things (id uuid primary key)')
  })

  test('commits the outbox messages recorded during the work', async ({ assert }) => {
    const outbox = new LucidOutbox()

    await new LucidUnitOfWork().run((transaction) => outbox.record(transaction, somethingHappened))

    const pending = await outbox.pending()
    assert.lengthOf(pending, 1)
    assert.containsSubset(pending[0], somethingHappened)
  })

  test('discards the outbox messages when the work fails', async ({ assert }) => {
    const outbox = new LucidOutbox()

    await assert.rejects(
      () =>
        new LucidUnitOfWork().run(async (transaction) => {
          await outbox.record(transaction, somethingHappened)
          throw new Error('Work failed')
        }),
      'Work failed'
    )

    assert.deepEqual(await outbox.pending(), [])
  })

  test('rolls back state changes and outbox messages together', async ({ assert }) => {
    const outbox = new LucidOutbox()

    await assert.rejects(
      () =>
        new LucidUnitOfWork().run(async (transaction) => {
          await lucidClient(transaction)
            .table('things')
            .insert({ id: somethingHappened.payload.thingId })
          await outbox.record(transaction, somethingHappened)
          throw new Error('Work failed')
        }),
      'Work failed'
    )

    assert.deepEqual(await db.from('things').select('id'), [])
    assert.deepEqual(await outbox.pending(), [])
  })
})
