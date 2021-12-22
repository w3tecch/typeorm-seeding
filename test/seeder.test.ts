import type { Connection } from 'typeorm'
import { configureConnection, fetchConnection, Seeder } from '../src'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { UserSeeder } from './seeders/User.seeder'

describe(Seeder, () => {
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

  describe(Seeder.prototype.run, () => {
    test('Should seed users', async () => {
      await new UserSeeder().run(connection)

      const [totalUsers, totalPets] = await Promise.all([
        connection.createEntityManager().count(User),
        connection.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(10)
    })
  })
})
