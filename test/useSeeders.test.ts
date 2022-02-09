import type { Connection } from 'typeorm'
import { configureConnection, fetchConnection, useSeeders } from '../src'
import { Country } from './entities/Country.entity'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { PetSeeder } from './seeders/Pet.seeder'
import { UserSeeder } from './seeders/User.seeder'

describe(useSeeders, () => {
  let connection: Connection

  beforeEach(async () => {
    configureConnection({ connection: 'memory' })
    connection = await fetchConnection()

    await connection.synchronize()
  })

  afterEach(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  test(`Should seed with only one seeder provided`, async () => {
    await useSeeders(UserSeeder)

    const em = connection.createEntityManager()
    const [totalUsers, totalPets, totalCountries] = await Promise.all([
      em.count(User),
      em.count(Pet),
      em.count(Country),
    ])

    expect(totalUsers).toBe(20)
    expect(totalPets).toBe(10)
    expect(totalCountries).toBe(20)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await useSeeders([UserSeeder, PetSeeder])

    const em = connection.createEntityManager()
    const [totalUsers, totalPets, totalCountries] = await Promise.all([
      em.count(User),
      em.count(Pet),
      em.count(Country),
    ])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(20)
    expect(totalCountries).toBe(30)
  })

  test(`Should seed with custom options`, async () => {
    await useSeeders(UserSeeder, {
      connection: 'memory',
    })

    const em = connection.createEntityManager()
    const [totalUsers, totalPets, totalCountries] = await Promise.all([
      em.count(User),
      em.count(Pet),
      em.count(Country),
    ])

    expect(totalUsers).toBe(20)
    expect(totalPets).toBe(10)
    expect(totalCountries).toBe(20)
  })
})
