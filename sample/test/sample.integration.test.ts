import {
  useSeeding,
  useRefreshDatabase,
  tearDownDatabase,
  factory,
  setConnectionOptions,
  ConnectionOptions,
  configureConnection,
} from '../../src/typeorm-seeding'
import { User } from '../entities/User.entity'
import { DataSource } from 'typeorm'
import { join } from 'path'

const inMemoryDb: ConnectionOptions = {
  name: 'memory',
  type: 'sqlite',
  database: ':memory:',
  entities: ['sample/entities/**/*{.ts,.js}'],
  factories: ['sample/factories/**/*{.ts,.js}'],
  seeds: ['sample/seeds/**/*{.ts,.js}'],
}

describe('Sample Integration Test', () => {
  let dataSource: DataSource

  afterEach(async () => {
    await tearDownDatabase()
  })

  test('Should create a user with the entity factory', async () => {
    setConnectionOptions(inMemoryDb)
    dataSource = await useRefreshDatabase()
    await useSeeding()

    const createdUser = await factory(User)().create()
    const user = await dataSource.getRepository(User).findOne({ where: { id: createdUser.id } })
    expect(createdUser.firstName).toBe(user.firstName)
  })

  test('Should be able to load a datasource.ts file', async () => {
    setConnectionOptions({})
    configureConnection({
      dataSourcePath: join(__dirname, 'datasource.ts'),
    })

    dataSource = await useRefreshDatabase()
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        database: ':memory:',
        entities: ['sample/entities/**/*{.ts,.js}'],
        name: 'file',
        type: 'sqlite',
      }),
    )
  })
})
