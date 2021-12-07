import { ConnectionOptionsReader, Connection, createConnection, getConnection } from 'typeorm'
import { ConnectionConfiguration, ConnectionOptions } from './types'

let connectionOptions: ConnectionOptions
let connectionConfiguration: ConnectionConfiguration = {}

const readConnectionOptions = async (): Promise<void> => {
  const { root, configName, connection } = connectionConfiguration
  const connectionReader = new ConnectionOptionsReader({
    root,
    configName,
  })

  const connectionName = connection || 'default'
  const options = (await connectionReader.get(connectionName)) as ConnectionOptions

  const factoriesFromEnv = process.env.TYPEORM_SEEDING_FACTORIES
  const seedersFromEnv = process.env.TYPEORM_SEEDING_SEEDS

  connectionOptions = {
    ...options,
    factories: factoriesFromEnv ? [factoriesFromEnv] : options.factories || [],
    seeds: seedersFromEnv ? [seedersFromEnv] : options.seeds || [],
  }
}

export const configureConnection = async (option: ConnectionConfiguration = {}) => {
  connectionConfiguration = {
    ...connectionConfiguration,
    ...option,
  }

  await readConnectionOptions()
}

export const getConnectionOptions = async (): Promise<ConnectionOptions> => {
  if (connectionOptions === undefined) {
    await readConnectionOptions()
  }

  return connectionOptions
}

export const fetchConnection = async (options?: Partial<ConnectionOptions>): Promise<Connection> => {
  const { connection: connectionName } = connectionConfiguration

  let connection: Connection
  try {
    connection = getConnection(connectionName)
  } catch {
    connection = await createConnection({
      ...getConnectionOptions(),
      ...options,
    } as ConnectionOptions)
  }

  return connection
}
