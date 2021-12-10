import { useSeeders } from '../../src/useSeeders'
import { SeederImportationError } from '../../src/errors/SeederImportationError'

describe(useSeeders, () => {
  test(`Should throw ${SeederImportationError.name}`, async () => {
    jest.mock('../seeders/2-Pet.seed.ts', () => {
      const test = 'test'

      return {
        _esModule: true,
        default: test,
      }
    })

    expect(useSeeders(true, ['test/**/2-Pet.seed.ts'])).rejects.toThrowError(SeederImportationError)
  })
})
