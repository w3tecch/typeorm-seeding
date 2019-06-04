import * as path from 'path'
import {
  Connection,
  createConnection as createTypeORMConnection,
  ConnectionOptions,
} from 'typeorm'

export const getConnectionOptions = async (configPath: string): Promise<ConnectionOptions> => {
    return require(path.join(process.cwd(), configPath))
}

export const createConnection = async (configPath: string): Promise<Connection> => {
  const options = await getConnectionOptions(configPath)
  return createTypeORMConnection(options)
}
