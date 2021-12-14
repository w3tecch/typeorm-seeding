import { FactoryNotDefinedError } from '../src/errors/FactoryNotDefinedError'
import { define, factory } from '../src/factoriesMap'
import { User } from './entities/User.entity'
import { userFactoryFn } from './factories/UserFactoryFunction'

describe('Factories map handler methods', () => {
  describe(factory, () => {
    beforeAll(() => {
      define(User, userFactoryFn)
    })

    afterAll(() => {
      define(User, undefined as any)
    })

    test('Should raise an error if there are no factory defined', () => {
      const TestEntity = (): any => void 0
      expect(() => factory(TestEntity)()).toThrow(FactoryNotDefinedError)
    })

    test('Should get factory defined for entity', () => {
      const userFactory = factory(User)()
      expect(userFactory).toBeDefined()
    })
  })
})
