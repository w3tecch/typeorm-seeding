import type { Connection } from 'typeorm'
import { configureConnection, fetchConnection, Seeder } from '../src'
import { Pet } from './fixtures/Pet.entity'
import { User } from './fixtures/User.entity'
import { UserSeeder } from './fixtures/User.seeder'

describe(Seeder, () => {
  let connection: Connection

  beforeAll(async () => {
    configureConnection({ connection: 'memory' })
    connection = await fetchConnection()

    await connection.synchronize()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  describe(Seeder.prototype.run, () => {
    test('Should seed users', async () => {
      await new UserSeeder().run(connection)

      const em = connection.createEntityManager()
      const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(60)
    })
  })
})
