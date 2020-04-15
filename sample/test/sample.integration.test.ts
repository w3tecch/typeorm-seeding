import { useSeeding, useRefreshDatabase, tearDownDatabase, factory } from '../../src/typeorm-seeding'
import { User } from '../entities/User.entity'
import { Connection } from 'typeorm'

describe('Sample Integration Test', () => {
  let connection: Connection
  beforeAll(async (done) => {
    connection = await useRefreshDatabase({ connection: 'memory' })
    await useSeeding()
    done()
  })

  afterAll(async (done) => {
    await tearDownDatabase()
  })

  test('Should create a user with the entity factory', async (done) => {
    const createdUser = await factory(User)().create()
    const user = await connection.getRepository(User).findOne(createdUser.id)
    expect(createdUser.firstName).toBe(user.firstName)
    done()
  })
})
