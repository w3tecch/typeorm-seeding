import { useSeeders } from '../../src'
import { SeederImportationError } from '../../src/errors/SeederImportationError'

describe(useSeeders, () => {
  test.only(`Should throw ${SeederImportationError.name}`, async () => {
    jest.mock('../seeders/User.seeder.ts', () => {
      throw new Error('Error')
    })

    expect(useSeeders()).rejects.toThrowError(SeederImportationError)
  })
})
