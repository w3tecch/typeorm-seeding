import { Connection, ConnectionOptionsReader } from 'typeorm'
import { configureConnection, fetchConnection, getConnectionOptions } from '../src/connection'
import { ConnectionOptions } from '../src/types'

describe('Connection global methods', () => {
  describe(getConnectionOptions, () => {
    test('Should get default connection', async () => {
      await configureConnection({ connection: 'default' })
      const options = await getConnectionOptions()

      expect(options.name).toBe('default')
    })

    test('Should get memory connection', async () => {
      await configureConnection({ connection: 'memory' })
      const options = await getConnectionOptions()

      expect(options.name).toBe('memory')
    })

    test('Should get connection without seeding variables', async () => {
      jest.spyOn(ConnectionOptionsReader.prototype, 'get').mockImplementationOnce(() =>
        Promise.resolve({
          name: 'memory',
        } as ConnectionOptions),
      )

      await configureConnection({ connection: 'memory' })
      const options = await getConnectionOptions()

      expect(options.name).toBe('memory')
      expect(options.factories).toBeInstanceOf(Array)
      expect(options.factories).toHaveLength(0)
      expect(options.seeds).toBeInstanceOf(Array)
      expect(options.seeds).toHaveLength(0)
    })

    test('Should get default connection with overrided env variables', async () => {
      const OLD_ENV = { ...process.env }
      process.env.TYPEORM_SEEDING_FACTORIES = 'overrided'
      process.env.TYPEORM_SEEDING_SEEDS = 'overrided'

      await configureConnection({ connection: 'default' })
      const options = await getConnectionOptions()
      expect(options.name).toBe('default')
      expect(options.factories).toBeInstanceOf(Array)
      expect(options.factories[0]).toBe('overrided')
      expect(options.seeds).toBeInstanceOf(Array)
      expect(options.seeds[0]).toBe('overrided')

      process.env = { ...OLD_ENV }
    })
  })

  describe(fetchConnection, () => {
    let connection: Connection

    beforeAll(async () => {
      await configureConnection({ connection: 'memory' })
    })

    afterAll(() => {
      if (connection) connection.close()
    })

    test('Should create a connection', async () => {
      connection = await fetchConnection()

      expect(connection).toBeInstanceOf(Connection)
      expect(connection.isConnected).toBeTruthy()
    })
  })
})
