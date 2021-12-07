import { factory } from '../src/factoriesMap'
import { useFactories } from '../src/useFactories'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'

describe('useFactory helper method', () => {
  describe(useFactories, () => {
    test('Should import all factories', async () => {
      await useFactories()
      expect(factory(User)()).toBeDefined()
      expect(factory(Pet)()).toBeDefined()
    })
  })
})
