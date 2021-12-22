import type { Connection } from 'typeorm'
import { configureConnection, fetchConnection, useSeeders } from '../src'
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

    const totalUsers = await connection.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await useSeeders([UserSeeder, PetSeeder])

    const [totalUsers, totalPets] = await Promise.all([
      connection.createEntityManager().count(User),
      connection.createEntityManager().count(Pet),
    ])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(20)
  })

  test(`Should seed with custom options`, async () => {
    await useSeeders(UserSeeder, {
      connection: 'memory',
    })

    const totalUsers = await connection.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })
})
