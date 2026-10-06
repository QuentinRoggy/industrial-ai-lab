import { SiteCode } from '#modules/organization/domain/site_code'
import { test } from '@japa/runner'

test.group('SiteCode', () => {
  test('normalises a code to trimmed upper case', ({ assert }) => {
    assert.equal(SiteCode.of('  lyon-01 ').toString(), 'LYON-01')
  })

  test('rejects codes that are empty, too long, or contain other characters', ({ assert }) => {
    for (const invalid of ['', '   ', 'LYON 01', 'LYÖN', '-LYON', 'A'.repeat(21)]) {
      assert.throws(() => SiteCode.of(invalid), `Invalid site code "${invalid}"`)
    }
  })
})
