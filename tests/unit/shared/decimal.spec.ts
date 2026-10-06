import { Decimal } from '#shared/domain/decimal'
import { test } from '@japa/runner'

test.group('Decimal', () => {
  test('adds without binary floating point error', ({ assert }) => {
    assert.equal(Decimal.of('0.1').plus(Decimal.of('0.2')).toString(), '0.3')
  })

  test('subtracts and tells whether the result is negative', ({ assert }) => {
    const result = Decimal.of('5').minus(Decimal.of('7.5'))

    assert.equal(result.toString(), '-2.5')
    assert.isTrue(result.isNegative())
    assert.isFalse(Decimal.of('0').isNegative())
  })

  test('multiplies exactly', ({ assert }) => {
    assert.equal(Decimal.of('0.35').times(Decimal.of('120')).toString(), '42')
    assert.equal(Decimal.of('1.1').times(Decimal.of('1.1')).toString(), '1.21')
  })

  test('never formats a value with an exponent', ({ assert }) => {
    assert.equal(Decimal.of('1e-7').toString(), '0.0000001')
    assert.equal(Decimal.of('12345678901234567890').toString(), '12345678901234567890')
  })

  test('compares two values', ({ assert }) => {
    const small = Decimal.of('1.25')
    const large = Decimal.of('10')

    assert.isTrue(small.lessThan(large))
    assert.isFalse(large.lessThan(small))
    assert.isTrue(large.greaterThan(small))
    assert.isFalse(small.greaterThan(Decimal.of('1.250')))
  })

  test('reads a PostgreSQL numeric string regardless of its scale', ({ assert }) => {
    const fromDatabase = Decimal.of('12.500000')

    assert.isTrue(fromDatabase.equals(Decimal.of('12.5')))
    assert.equal(fromDatabase.toString(), '12.5')
  })

  test('rejects a value that is not a decimal number', ({ assert }) => {
    assert.throws(() => Decimal.of('12,5'), 'Invalid decimal value "12,5"')
    assert.throws(() => Decimal.of(''), 'Invalid decimal value ""')
  })
})
