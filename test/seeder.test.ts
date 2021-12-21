import { Connection } from 'typeorm'
import { configureConnection, fetchConnection, Seeder } from '../src'
import { User } from './entities/User.entity'
import { UserSeeder } from './seeders/User.seeder'

describe(Seeder, () => {
  let connection: Connection
  const userSeeder = new UserSeeder()

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
      await userSeeder.run()

      const totalItems = await connection.createEntityManager().count(User)
      expect(totalItems).toBe(10)
    })
  })
})
