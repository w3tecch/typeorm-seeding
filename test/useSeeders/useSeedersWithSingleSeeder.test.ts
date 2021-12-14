import { useSeeders } from '../../src/useSeeders'
import { Seeder } from '../../src/seeder'

describe(useSeeders, () => {
  const mockFn = jest.fn()

  beforeEach(() => {
    mockFn.mockClear()
  })

  test('Should import one seeder and execute it', async () => {
    jest.mock('../seeders/1-User.seed.ts', () => {
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
})
