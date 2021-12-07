import { Connection } from 'typeorm'
import { define, factory, runSeeder, Seeder, useFactories } from '../src'
import { configureConnection, fetchConnection, getConnectionOptions } from '../src/connection'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { petFactoryFn } from './factories/PetFactoryFunction'
import { userFactoryFn } from './factories/UserFactoryFunction'
import PetSeeder from './seeders/Pet.seed'

describe('Facade global methods', () => {
  describe(factory, () => {
    beforeAll(() => {
      define(User, userFactoryFn)
    })

    afterAll(() => {
      define(User, undefined as any)
    })

    test('Should raise an error if there are no factory defined', () => {
      const TestEntity = (): any => void 0
      expect(() => factory(TestEntity)()).toThrow(Error)
    })

    test('Should get factory defined for entity', () => {
      const userFactory = factory(User)()
      expect(userFactory).toBeDefined()
    })
  })

  describe(useFactories, () => {
    beforeEach(() => {
      define(User, undefined as any)
      define(Pet, undefined as any)
    })

    afterAll(() => {
      define(User, undefined as any)
      define(Pet, undefined as any)
    })

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
