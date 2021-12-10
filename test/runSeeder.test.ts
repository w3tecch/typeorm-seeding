import { runSeeder } from '../src/runSeeder'
import PetSeeder from './seeders/2-Pet.seed'

describe(runSeeder, () => {
  test('Should seed', async () => {
    const mockFn = jest.fn()
    jest.spyOn(PetSeeder.prototype, 'run').mockImplementation(mockFn)

    await runSeeder(new PetSeeder())

    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
