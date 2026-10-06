import { moduleNames } from '#modules/manifest'
import { test } from '@japa/runner'

test.group('Module manifest', () => {
  test('contains unique bounded context names', ({ assert }) => {
    assert.equal(new Set(moduleNames).size, moduleNames.length)
  })

  test('contains the deterministic core and lab boundaries', ({ assert }) => {
    assert.includeMembers([...moduleNames], ['inventory', 'manufacturing', 'simulation', 'lab'])
  })
})
