import { useSeeders } from '../../src/useSeeders'

describe(useSeeders, () => {
  test('Should import all seeders', async () => {
    const seeders = await useSeeders()

    expect(seeders).toHaveLength(1)
    expect(seeders[0].constructor.name).toBe('UserSeeder')
  })
})

