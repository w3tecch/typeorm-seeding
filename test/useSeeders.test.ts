import { useSeeders } from '../src/useSeeders'
import { Seeder } from '../src/seeder'
import { SeederImportationError } from '../src/errors/SeederImportationError'

describe(useSeeders, () => {
  const mockFn = jest.fn()

  beforeEach(() => {
    mockFn.mockClear()
  })

  test('Should import all seeders and not execute them', async () => {
    const seeders = await useSeeders()

    expect(seeders).toHaveLength(2)
    expect(seeders[0].name).toBe('UserSeeder')
    expect(seeders[1].name).toBe('PetSeeder')
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  test('Should import one seeder and execute it', async () => {
    jest.mock('./seeders/1-User.seed.ts', () => {
      return {
        __esModule: true,
        default: class Test extends Seeder {
          async run() {
            mockFn()
          }
        },
      }
    })
    const seeders = await useSeeders(true, ['test/**/1-User.seed.ts'])

    expect(seeders).toHaveLength(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test(`Should throw ${SeederImportationError.name}`, async () => {
    jest.mock('./seeders/2-Pet.seed.ts', () => {
      throw new Error()
    })

    expect(useSeeders(true, ['test/**/2-Pet.seed.ts'])).rejects.toThrowError(SeederImportationError)
  })
})
