import { factory } from '../../src/factoriesMap'
import { useFactories } from '../../src/useFactories'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

describe(useFactories, () => {
  test('Should import selected factories by glob expression', async () => {
    await useFactories(['test/**/User.factory.ts'])
    expect(factory(User)()).toBeDefined()
    expect(() => factory(Pet)()).toThrowError(Error)
  })
})
