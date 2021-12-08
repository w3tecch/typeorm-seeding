import { FactoryImportationError } from '../src/errors/FactoryImportationError'
import { clearFactories, define, factory } from '../src/factoriesMap'
import { useFactories } from '../src/useFactories'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { userFactoryFn } from './factories/UserFactoryFunction'

describe(useFactories, () => {
  beforeEach(() => {
    clearFactories()
  })

  test('Should import all factories', async () => {
    await useFactories()
    expect(factory(User)()).toBeDefined()
    expect(factory(Pet)()).toBeDefined()
  })

  test('Should import selected factories by glob expression', async () => {
    jest.mock('./factories/User.factory.ts', () => {
      define(User, userFactoryFn)
    })

    await useFactories(['test/**/User.factory.ts'])
    expect(factory(User)()).toBeDefined()
    expect(() => factory(Pet)()).toThrowError(Error)
  })

  test(`Should throw ${FactoryImportationError.name}`, () => {
    jest.mock('./factories/Pet.factory.ts', () => {
      throw new Error()
    })

    expect(useFactories()).rejects.toThrowError(FactoryImportationError)
  })
})
