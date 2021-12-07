import { runSeeder, useFactories } from '../src/facade'
import { factory } from '../src/factoriesMap'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import PetSeeder from './seeders/Pet.seed'

describe('Facade global methods', () => {
  describe(useFactories, () => {
    test('Should import all factories', async () => {
      await useFactories()
      expect(factory(User)()).toBeDefined()
      expect(factory(Pet)()).toBeDefined()
    })
  })

  describe(runSeeder, () => {
    let mockFn: jest.Mock

    beforeAll(() => {
      mockFn = jest.fn()
      jest.spyOn(PetSeeder.prototype, 'run').mockImplementation(mockFn)
    })

    beforeEach(() => {
      mockFn.mockClear()
    })

    afterAll(() => {
      mockFn.mockRestore()
    })

    test('Should do nothing without proper seeder', async () => {
      await runSeeder(class Test {})
      expect(mockFn).toHaveBeenCalledTimes(0)
    })

    test('Should seed', async () => {
      await runSeeder(PetSeeder)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
})
