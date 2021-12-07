import {
  ConnectionOptionsReader,
  Connection,
  ConnectionOptions as TypeORMConnectionOptions,
  createConnection,
  getConnection,
} from 'typeorm'

export declare type ConnectionOptions = TypeORMConnectionOptions & {
  factories: string[]
  seeds: string[]
}
let connectionOptions: ConnectionOptions
let partialConnectionOptions: Partial<ConnectionOptions> = {}

export type ConnectionConfiguration = {
  root?: string
  configName?: string
  connection?: string
}
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

export const setConnectionOptions = (options: Partial<ConnectionOptions>): void => {
  partialConnectionOptions = options
}

export const fetchConnection = async (): Promise<Connection> => {
  const { connection: connectionName } = connectionConfiguration
  if (connectionOptions === undefined) {
    await readConnectionOptions()
  }

  let connection: Connection
  try {
    connection = getConnection(connectionName)
  } catch {
    connection = await createConnection({
      ...connectionOptions,
      ...partialConnectionOptions,
    } as TypeORMConnectionOptions)
  }

  return connection
}
