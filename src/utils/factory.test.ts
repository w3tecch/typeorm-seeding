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
  test('Passing undefinde as a enity-class should throw an error', () => {
    try {
      getNameOfEntity(undefined)
    } catch (error) {
      expect(error.message).toBe('Enity is not defined')
    }
  })
})
describe('isPromiseLike', () => {
  test('Passing a promise should return true', () => {
    const promise = new Promise(() => void 0)
    expect(isPromiseLike(promise)).toBeTruthy()
  })
  test('Passing no promise should return false', () => {
    expect(isPromiseLike(undefined)).toBeFalsy()
    expect(isPromiseLike(null)).toBeFalsy()
    expect(isPromiseLike('')).toBeFalsy()
    expect(isPromiseLike(42)).toBeFalsy()
    expect(isPromiseLike(true)).toBeFalsy()
    expect(isPromiseLike(false)).toBeFalsy()
    expect(isPromiseLike([])).toBeFalsy()
    expect(isPromiseLike({})).toBeFalsy()
    expect(isPromiseLike((): any => void 0)).toBeFalsy()
    // tslint:disable-next-line
    class UserEntity {}
    expect(isPromiseLike(new UserEntity())).toBeFalsy()
    expect(isPromiseLike(new Date())).toBeFalsy()
  })
})
