import { ConnectionOptionsReader } from 'typeorm'
import { configureConnection, getConnectionOptions } from '../../src/connection'
import { DefaultSeederNotDefinedError } from '../../src/errors/DefaultSeederNotDefinedError'
import type { ConnectionOptions } from '../../src/types'

describe(getConnectionOptions, () => {
  test('Should get default connection', async () => {
    const options = await getConnectionOptions()

    expect(options.name).toBe('default')
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get memory connection', async () => {
    configureConnection({ connection: 'memory' })
    const options = await getConnectionOptions()

    expect(options.name).toBe('memory')
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get connection without seeding variables', async () => {
    jest
      .spyOn(ConnectionOptionsReader.prototype, 'get')
      .mockImplementationOnce(() => Promise.resolve({} as ConnectionOptions))

    expect(getConnectionOptions()).rejects.toThrowError(DefaultSeederNotDefinedError)
  })

  test('Should get default connection without seeders', async () => {
    jest.spyOn(ConnectionOptionsReader.prototype, 'get').mockImplementationOnce(() =>
      Promise.resolve({
        defaultSeeder: 'overrided',
      } as ConnectionOptions),
    )

    const options = await getConnectionOptions()
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.seeders).toHaveLength(0)
    expect(options.defaultSeeder).toBeDefined()
    expect(options.defaultSeeder).toBe('overrided')
  })

  test('Should get default connection with overrided env variables', async () => {
    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_SEEDERS = 'overrided'
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDER = 'overrided'

    configureConnection({ connection: 'default' })
    const options = await getConnectionOptions()
    expect(options.name).toBe('default')
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.seeders[0]).toBe('overrided')
    expect(options.defaultSeeder).toBeDefined()
    expect(options.defaultSeeder).toBe('overrided')

    process.env = { ...OLD_ENV }
  })
})
