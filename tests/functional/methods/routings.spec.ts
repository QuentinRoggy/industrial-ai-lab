import { catalogModule } from '#modules/catalog/catalog_module'
import { AccessDenied } from '#modules/iam/application/access_control'
import { methodsModule } from '#modules/methods/methods_module'
import { FixedClock } from '#shared/domain/clock'
import { userWithRoles } from '#tests/helpers/users'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

const clock = new FixedClock(new Date('2026-03-02T08:00:00.000Z'))

const item = {
  description: 'Machined valve body',
  stockUnit: 'unit',
  lotTracked: true,
  leadTimeDays: 5,
  receiptInspection: false,
  finalInspection: false,
}

async function setUp() {
  const methodsManager = await userWithRoles('methods@lab.test', ['methods_manager'])
  const catalog = catalogModule({ clock })
  const methods = methodsModule({ clock })
  const valveBody = await catalog.createItem.execute(methodsManager, {
    ...item,
    code: 'VALVE-BODY',
    purchased: false,
    manufactured: true,
  })
  const lathe = await methods.createWorkCentre.execute(methodsManager, {
    code: 'LATHE',
    name: 'CNC lathe',
  })
  const turning = {
    sequence: 10,
    workCentreId: lathe.id,
    setupMinutes: '30',
    runMinutesPerUnit: '4.5',
  }

  return { methodsManager, catalog, methods, valveBody, lathe, turning }
}

test.group('Routings', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('a methods manager drafts, revises, and approves a routing that becomes effective', async ({
    assert,
  }) => {
    const { methodsManager, methods, valveBody, turning } = await setUp()

    const draft = await methods.draftRouting.execute(methodsManager, {
      itemId: valveBody.id,
      operations: [turning],
    })
    await methods.reviseRouting.execute(methodsManager, {
      routingId: draft.id,
      operations: [turning, { ...turning, sequence: 20, runMinutesPerUnit: '2' }],
    })
    await methods.approveRouting.execute(methodsManager, {
      routingId: draft.id,
      effectiveFrom: '2026-03-10',
    })

    assert.isNull(await methods.routings.effectiveFor(valveBody.id, '2026-03-09'))
    assert.deepEqual(await methods.routings.effectiveFor(valveBody.id, '2026-03-10'), {
      id: draft.id,
      itemId: valveBody.id,
      number: 1,
      status: 'approved',
      effectiveFrom: '2026-03-10',
      operations: [
        { ...turning, setupMinutes: '30', runMinutesPerUnit: '4.5' },
        { ...turning, sequence: 20, setupMinutes: '30', runMinutesPerUnit: '2' },
      ],
    })
  })

  test('a later approved version takes over from its effective date', async ({ assert }) => {
    const { methodsManager, methods, valveBody, turning } = await setUp()
    const first = await methods.draftRouting.execute(methodsManager, {
      itemId: valveBody.id,
      operations: [turning],
    })
    await methods.approveRouting.execute(methodsManager, {
      routingId: first.id,
      effectiveFrom: '2026-03-10',
    })
    const second = await methods.draftRouting.execute(methodsManager, {
      itemId: valveBody.id,
      operations: [{ ...turning, runMinutesPerUnit: '3' }],
    })

    await assert.rejects(
      () =>
        methods.approveRouting.execute(methodsManager, {
          routingId: second.id,
          effectiveFrom: '2026-03-10',
        }),
      'A routing must take effect after the latest approved version (2026-03-10)'
    )
    await methods.approveRouting.execute(methodsManager, {
      routingId: second.id,
      effectiveFrom: '2026-04-01',
    })

    const beforeSwitch = await methods.routings.effectiveFor(valveBody.id, '2026-03-31')
    const afterSwitch = await methods.routings.effectiveFor(valveBody.id, '2026-04-01')
    assert.equal(beforeSwitch?.number, 1)
    assert.equal(afterSwitch?.number, 2)
    await assert.rejects(
      () =>
        methods.reviseRouting.execute(methodsManager, {
          routingId: first.id,
          operations: [turning],
        }),
      'Only a draft routing can be revised'
    )
  })

  test('an obsolete routing stops applying from today without reviving the one it replaced', async ({
    assert,
  }) => {
    const { methodsManager, methods, valveBody, turning } = await setUp()
    const first = await methods.draftRouting.execute(methodsManager, {
      itemId: valveBody.id,
      operations: [turning],
    })
    await methods.approveRouting.execute(methodsManager, {
      routingId: first.id,
      effectiveFrom: '2026-03-02',
    })
    await methods.makeRoutingObsolete.execute(methodsManager, { routingId: first.id })

    const effective = await methods.routings.effectiveFor(valveBody.id, '2026-03-02')
    assert.isNull(effective)
  })

  test('only a manufactured item has a routing, made of known work centres', async ({ assert }) => {
    const { methodsManager, catalog, methods, valveBody, turning } = await setUp()
    const seal = await catalog.createItem.execute(methodsManager, {
      ...item,
      code: 'SEAL',
      purchased: true,
      manufactured: false,
    })

    await assert.rejects(
      () =>
        methods.draftRouting.execute(methodsManager, { itemId: seal.id, operations: [turning] }),
      'Only a manufactured item can have a routing'
    )
    await assert.rejects(
      () =>
        methods.draftRouting.execute(methodsManager, {
          itemId: valveBody.id,
          operations: [{ ...turning, workCentreId: '9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a' }],
        }),
      'Unknown work centre 9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a'
    )
  })

  test('a user without the permission cannot manage routings or work centres', async ({
    assert,
  }) => {
    const { methods, valveBody, turning } = await setUp()
    const planner = await userWithRoles('planner@lab.test', ['planner'])

    await assert.rejects(
      () => methods.createWorkCentre.execute(planner, { code: 'MILL', name: 'Mill' }),
      AccessDenied
    )
    await assert.rejects(
      () => methods.draftRouting.execute(planner, { itemId: valveBody.id, operations: [turning] }),
      AccessDenied
    )
  })
})
