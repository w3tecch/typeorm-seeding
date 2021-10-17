import { getNameOfEntity, isPromiseLike } from './factory.util'

describe('getNameOfClass', () => {
  test('Passing UserEnity class should return the name of the class', () => {
    class UserEntity {}
    expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
  })

  test('Passing UserEnity function should return the name of the function', () => {
    const UserEntity = (): any => void 0
    expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
  })

  test('Passing undefined as a entity-class should throw an error', () => {
    expect(() => getNameOfEntity(undefined as any)).toThrow('Entity is not defined')
  })
})

describe('isPromiseLike', () => {
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
