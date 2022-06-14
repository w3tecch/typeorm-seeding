import { useDataSource, useSeeders } from '../../src'
import { dataSource } from '../fixtures/dataSource'
import { Pet } from '../fixtures/Pet.entity'
import { PetSeeder } from '../fixtures/Pet.seeder'
import { User } from '../fixtures/User.entity'
import { UserSeeder } from '../fixtures/User.seeder'

describe(useSeeders, () => {
  beforeAll(async () => {
    await useDataSource(dataSource, true)
  })

  beforeEach(async () => {
    await dataSource.synchronize()
  })

  afterEach(async () => {
    await dataSource.dropDatabase()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  test(`Should seed with only one seeder provided`, async () => {
    await useSeeders(UserSeeder)

    const em = dataSource.createEntityManager()
    const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

    expect(totalUsers).toBe(2)
    expect(totalPets).toBe(1)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await useSeeders([UserSeeder, PetSeeder])

    const em = dataSource.createEntityManager()
    const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

    expect(totalUsers).toBe(3)
    expect(totalPets).toBe(2)
  })
})
