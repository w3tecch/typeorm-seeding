import { getNameOfEntity } from '../../src/utils/getNameOfEntity'

describe(getNameOfEntity, () => {
  test('Passing UserEntity class should return the name of the class', () => {
    class UserEntity {}
    expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
  })

  test('Passing UserEntity function should return the name of the function', () => {
    const UserEntity = (): any => void 0
    expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
  })

  test('Passing something not instantiable should raise Error', () => {
    expect(() => getNameOfEntity('test' as any)).toThrowError('Entity is not defined')
  })
})
