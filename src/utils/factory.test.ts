import { getNameOfEntity } from './factory.util'

describe('utils/factory', () => {
  describe('getNameOfClass', () => {
    test('Pass UserEnity class should return the name of the class', () => {
      class UserEntity {}
      expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
    })
    test('Pass UserEnity function should return the name of the function', () => {
      function UserEntity() {}
      expect(getNameOfEntity(UserEntity)).toBe('UserEntity')
    })
    test('Pass undefinde as a enity-class should throw an error', () => {
      try {
        getNameOfEntity(undefined)
      } catch (error) {
        expect(error.message).toBe('Enity is not defined')
      }
    })
  })
})
