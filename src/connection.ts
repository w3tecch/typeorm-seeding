import * as path from 'path'
import {
  Connection,
  createConnection as createTypeORMConnection,
  ConnectionOptions as TypeORMConnectionOptions,
} from 'typeorm'

interface SeedingOptions {
  readonly factories: string[]
  readonly seeds: string[]
}

export declare type ConnectionOptions = TypeORMConnectionOptions & SeedingOptions

export const getConnectionOptions = async (configPath = 'ormconfig.js'): Promise<ConnectionOptions> => {
  return require(path.join(process.cwd(), configPath))
}

export const createConnection = async (configPath: string): Promise<Connection> => {
  const options = await getConnectionOptions(configPath)
  return createTypeORMConnection(options as TypeORMConnectionOptions)
}
