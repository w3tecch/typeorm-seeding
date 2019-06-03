import { getNameOfClass } from './factory.util'

describe('utils/factory', () => {
  describe('getNameOfClass', () => {
    test('Pass UserEnity should return the name of the class', () => {
      class UserEntity {}
      expect(getNameOfClass(UserEntity)).toBe('UserEntity')
    })
    test('Pass UserEnity should return the name of the function', () => {
      function UserEntity() {}
      expect(getNameOfClass(UserEntity)).toBe('UserEntity')
    })
    test('Pass undefinde as a enity-class should throw an error', () => {
      try {
        getNameOfClass(undefined)
      } catch (error) {
        expect(error.message).toBe('Enity is not defined')
      }
    })
  })
})
