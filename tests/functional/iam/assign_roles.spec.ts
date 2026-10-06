import User from '#models/user'
import { AccessDenied } from '#modules/iam/application/access_control'
import { iamModule } from '#modules/iam/iam_module'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

async function user(email: string) {
  const created = await User.create({ email, password: 'secret-password' })
  return { userId: created.id }
}

test.group('Assign roles', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('an IT administrator gives a user several roles whose permissions add up', async ({
    assert,
  }) => {
    const iam = iamModule()
    const admin = await user('admin@lab.test')
    await iam.seedRoles(admin.userId, ['it_administrator'])
    const colleague = await user('colleague@lab.test')

    await iam.assignRoles.execute(admin, {
      userId: colleague.userId,
      roles: ['buyer', 'it_administrator'],
    })

    assert.deepEqual(await iam.rolesOf(colleague.userId), ['buyer', 'it_administrator'])
    await iam.accessControl.ensure(colleague, 'organization.create_site')
  })

  test('a user without the permission cannot assign roles', async ({ assert }) => {
    const iam = iamModule()
    const buyer = await user('buyer@lab.test')
    await iam.seedRoles(buyer.userId, ['buyer'])

    await assert.rejects(
      () => iam.assignRoles.execute(buyer, { userId: buyer.userId, roles: ['it_administrator'] }),
      AccessDenied
    )
    assert.deepEqual(await iam.rolesOf(buyer.userId), ['buyer'])
  })

  test('a user keeps at least one known role', async ({ assert }) => {
    const iam = iamModule()
    const admin = await user('admin@lab.test')
    await iam.seedRoles(admin.userId, ['it_administrator'])
    const colleague = await user('colleague@lab.test')
    await iam.seedRoles(colleague.userId, ['buyer'])

    await assert.rejects(
      () => iam.assignRoles.execute(admin, { userId: colleague.userId, roles: [] }),
      'A user needs at least one role'
    )
    await assert.rejects(
      () =>
        iam.assignRoles.execute(admin, { userId: colleague.userId, roles: ['buyer', 'janitor'] }),
      'Unknown roles: janitor'
    )
    await assert.rejects(
      () => iam.assignRoles.execute(admin, { userId: 999_999, roles: ['buyer'] }),
      'Unknown user 999999'
    )
    assert.deepEqual(await iam.rolesOf(colleague.userId), ['buyer'])
  })
})
