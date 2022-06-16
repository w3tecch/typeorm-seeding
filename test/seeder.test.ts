import { Seeder, useDataSource } from '../src'
import { dataSource } from './fixtures/dataSource'
import { Pet } from './fixtures/Pet.entity'
import { User } from './fixtures/User.entity'
import { UserSeeder } from './fixtures/User.seeder'

describe(Seeder, () => {
  beforeAll(async () => {
    await useDataSource(dataSource, { synchronize: true }, true)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe(Seeder.prototype.run, () => {
    test('Should seed users', async () => {
      await new UserSeeder().run(dataSource)

      const em = dataSource.createEntityManager()
      const [totalUsers, totalPets] = await Promise.all([em.count(User), em.count(Pet)])

      expect(totalUsers).toBe(2)
      expect(totalPets).toBe(1)
    })
  })
})
