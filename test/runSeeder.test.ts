import { runSeeder } from '../src/runSeeder'
import PetSeeder from './seeders/2-Pet.seed'

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
