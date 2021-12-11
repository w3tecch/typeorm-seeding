import { FactoryImportationError } from '../../src/errors/FactoryImportationError'
import { useFactories } from '../../src/useFactories'

describe(useFactories, () => {
  test(`Should throw ${FactoryImportationError.name}`, () => {
    jest.mock('../factories/Pet.factory.ts', () => {
      throw new Error()
    })

    expect(useFactories()).rejects.toThrowError(FactoryImportationError)
  })
})
