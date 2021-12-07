import { User } from '../entities/User.entity'
import { Connection } from 'typeorm'
import { useRefreshDatabase, useSeeding, tearDownDatabase, factory, fetchConnection } from '../../src'

describe('Sample Integration Test', () => {
  let connection: Connection
  beforeAll(async () => {
    connection = await fetchConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: ['sample/entities/**/*{.ts,.js}'],
    })
    connection = await useRefreshDatabase()
    await useSeeding()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  test('Should create a user with the entity factory', async () => {
    const createdUser = await factory(User)().create()
    const user = await connection.getRepository(User).findOne(createdUser.id)
    expect(createdUser.firstName).toBe(user?.firstName)
  })
})
