import { Item, type ItemDefinition } from '#modules/catalog/domain/item'
import { test } from '@japa/runner'

const brassBar: ItemDefinition = {
  code: 'BRASS-BAR-20',
  description: 'Brass bar, 20 mm',
  purchased: true,
  manufactured: false,
  stockUnit: 'kg',
  lotTracked: true,
  leadTimeDays: 10,
  receiptInspection: true,
  finalInspection: false,
}

test.group('Item', () => {
  test('defines an item from its attributes', ({ assert }) => {
    const item = Item.create({ ...brassBar, code: ' brass-bar-20 ' })

    assert.equal(item.code.toString(), 'BRASS-BAR-20')
    assert.isTrue(item.purchased)
    assert.equal(item.stockUnit, 'kg')
    assert.equal(item.leadTimeDays, 10)
  })

  test('is purchased, manufactured, or both, never neither', ({ assert }) => {
    assert.throws(
      () => Item.create({ ...brassBar, purchased: false, manufactured: false }),
      'An item must be purchased, manufactured, or both'
    )
    assert.doesNotThrow(() => Item.create({ ...brassBar, purchased: true, manufactured: true }))
  })

  test('has a lead time in whole, non-negative calendar days', ({ assert }) => {
    for (const leadTimeDays of [-1, 1.5, Number.NaN, 3651]) {
      assert.throws(
        () => Item.create({ ...brassBar, leadTimeDays }),
        'Lead time must be a whole number of days between 0 and 3650'
      )
    }
    assert.equal(Item.create({ ...brassBar, leadTimeDays: 0 }).leadTimeDays, 0)
  })

  test('is counted in a known stock unit', ({ assert }) => {
    assert.throws(
      () => Item.create({ ...brassBar, stockUnit: 'barrel' }),
      'Unknown stock unit "barrel"'
    )
  })

  test('requires receipt inspection only when purchased and final inspection only when manufactured', ({
    assert,
  }) => {
    assert.throws(
      () =>
        Item.create({ ...brassBar, purchased: false, manufactured: true, receiptInspection: true }),
      'Only a purchased item can require a receipt inspection'
    )
    assert.throws(
      () => Item.create({ ...brassBar, finalInspection: true }),
      'Only a manufactured item can require a final inspection'
    )
  })

  test('has a description', ({ assert }) => {
    assert.throws(
      () => Item.create({ ...brassBar, description: '  ' }),
      'An item needs a description'
    )
  })
})
