import { AccessDenied } from '#modules/iam/application/access_control'
import { organizationModule } from '#modules/organization/organization_module'
import { FixedClock } from '#shared/domain/clock'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { userWithRoles } from '#tests/helpers/users'

const clock = new FixedClock(new Date('2026-03-02T08:00:00.000Z'))

const itAdministrator = () => userWithRoles('admin@lab.test', ['it_administrator'])

test.group('Create site', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('an IT administrator creates a site in the organization', async ({ assert }) => {
    const admin = await itAdministrator()
    const organization = organizationModule({ clock })

    await organization.setUpOrganization.execute(admin, { name: 'Valve Works' })
    const site = await organization.createSite.execute(admin, { code: 'lyon', name: 'Lyon plant' })

    assert.deepEqual(site, { id: site.id, code: 'LYON', name: 'Lyon plant' })
    assert.deepEqual(await organization.sites.list(), [site])
  })

  test('a user without the organization permission cannot set up the organization or create a site', async ({
    assert,
  }) => {
    const admin = await itAdministrator()
    const buyer = await userWithRoles('buyer@lab.test', ['buyer'])
    const organization = organizationModule({ clock })
    await organization.setUpOrganization.execute(admin, { name: 'Valve Works' })

    await assert.rejects(
      () => organization.createSite.execute(buyer, { code: 'LYON', name: 'Lyon plant' }),
      AccessDenied
    )
    await assert.rejects(
      () => organization.setUpOrganization.execute(buyer, { name: 'Other' }),
      AccessDenied
    )
    assert.deepEqual(await organization.sites.list(), [])
  })

  test('a site code is unique regardless of case', async ({ assert }) => {
    const admin = await itAdministrator()
    const organization = organizationModule({ clock })
    await organization.setUpOrganization.execute(admin, { name: 'Valve Works' })
    await organization.createSite.execute(admin, { code: 'LYON', name: 'Lyon plant' })

    await assert.rejects(
      () => organization.createSite.execute(admin, { code: 'lyon', name: 'Second Lyon plant' }),
      'Site code "LYON" is already used'
    )
    assert.lengthOf(await organization.sites.list(), 1)
  })

  test('there is a single organization, set up before any site', async ({ assert }) => {
    const admin = await itAdministrator()
    const organization = organizationModule({ clock })

    await assert.rejects(
      () => organization.createSite.execute(admin, { code: 'LYON', name: 'Lyon plant' }),
      'The organization is not set up yet'
    )

    await organization.setUpOrganization.execute(admin, { name: 'Valve Works' })
    await assert.rejects(
      () => organization.setUpOrganization.execute(admin, { name: 'Other Works' }),
      'The organization is already set up'
    )
  })
})
