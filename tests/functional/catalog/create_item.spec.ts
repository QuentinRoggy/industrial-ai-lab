import { AccessDenied } from '#modules/iam/application/access_control'
import { catalogModule } from '#modules/catalog/catalog_module'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { userWithRoles } from '#tests/helpers/users'

const valveBody = {
  code: 'VALVE-BODY',
  description: 'Machined valve body',
  purchased: false,
  manufactured: true,
  stockUnit: 'unit',
  lotTracked: true,
  leadTimeDays: 5,
  receiptInspection: false,
  finalInspection: true,
}

test.group('Create item', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('a methods manager creates an item', async ({ assert }) => {
    const methodsManager = await userWithRoles('methods@lab.test', ['methods_manager'])
    const catalog = catalogModule()

    const item = await catalog.createItem.execute(methodsManager, valveBody)

    assert.deepEqual(item, { id: item.id, ...valveBody })
    assert.deepEqual(await catalog.items.list(), [item])
  })

  test('a user without the permission cannot create an item', async ({ assert }) => {
    const buyer = await userWithRoles('buyer@lab.test', ['buyer'])
    const catalog = catalogModule()

    await assert.rejects(() => catalog.createItem.execute(buyer, valveBody), AccessDenied)
    assert.deepEqual(await catalog.items.list(), [])
  })

  test('an item code is unique regardless of case', async ({ assert }) => {
    const methodsManager = await userWithRoles('methods@lab.test', ['methods_manager'])
    const catalog = catalogModule()
    await catalog.createItem.execute(methodsManager, valveBody)

    await assert.rejects(
      () => catalog.createItem.execute(methodsManager, { ...valveBody, code: 'valve-body' }),
      'Item code "VALVE-BODY" is already used'
    )
  })

  test('an item that breaks a catalog rule is refused', async ({ assert }) => {
    const methodsManager = await userWithRoles('methods@lab.test', ['methods_manager'])
    const catalog = catalogModule()

    await assert.rejects(
      () =>
        catalog.createItem.execute(methodsManager, {
          ...valveBody,
          purchased: false,
          manufactured: false,
        }),
      'An item must be purchased, manufactured, or both'
    )
    assert.deepEqual(await catalog.items.list(), [])
  })
})
