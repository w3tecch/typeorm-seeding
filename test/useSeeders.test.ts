import type { Connection } from 'typeorm'
import { configureConnection, fetchConnection, useSeeders } from '../src'
import { Pet } from './fixtures/Pet.entity'
import { PetSeeder } from './fixtures/Pet.seeder'
import { User } from './fixtures/User.entity'
import { UserSeeder } from './fixtures/User.seeder'

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
    const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

    expect(totalUsers).toBe(20)
    expect(totalPets).toBe(60)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await useSeeders([UserSeeder, PetSeeder])

    const em = connection.createEntityManager()
    const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(70)
  })

  test(`Should seed with custom options`, async () => {
    await useSeeders(UserSeeder, {
      connection: 'memory',
    })

    const em = connection.createEntityManager()
    const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

    expect(totalUsers).toBe(20)
    expect(totalPets).toBe(60)
  })
})
