import { useSeeders } from '../../src/useSeeders'

describe(useSeeders, () => {
  test('Should import all seeders and not execute them', async () => {
    const seeders = await useSeeders()

    expect(seeders).toHaveLength(2)
    expect(seeders[0].constructor.name).toBe('UserSeeder')
    expect(seeders[1].constructor.name).toBe('PetSeeder')
  })
})
