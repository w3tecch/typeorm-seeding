import { isPromiseLike } from '../../src/utils/isPromiseLike'

describe(isPromiseLike, () => {
  test('Passing promise should return true', () => {
    const promise = new Promise(() => void 0)
    expect(isPromiseLike(promise)).toBeTruthy()
  })

  test.each([
    ['undefined', undefined],
    ['null', null],
    ['string', ''],
    ['number', 1],
    ['boolean', true],
    ['boolean', false],
    ['array', []],
    ['object', {}],
    ['function', () => true],
    ['date', new Date()],
  ])('Passing %s should return false', (_, value) => {
    expect(isPromiseLike(value)).toBeFalsy()
  })

  test('Passing class instace should return false', () => {
    class Test {}
    expect(isPromiseLike(new Test())).toBeFalsy()
  })
})
