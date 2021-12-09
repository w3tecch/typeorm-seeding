import { Connection } from 'typeorm'
import { configureConnection, fetchConnection } from './connection'
import { ConnectionConfiguration } from './types'

/**
 * I believe this library just cover seeding and factory creation, so database cleanup is out of scope
 * @deprecated
 */
/* istanbul ignore next */
export const useRefreshDatabase = async (options: Partial<ConnectionConfiguration> = {}): Promise<Connection> => {
  await configureConnection(options)
  const connection = await fetchConnection()
  if (connection && connection.isConnected) {
    await connection.dropDatabase()
    await connection.synchronize()
  }
  return connection
}

/**
 * I believe this library just cover seeding and factory creation, so database disconnection is out of scope
 * @deprecated
 */
/* istanbul ignore next */
export const tearDownDatabase = async (): Promise<void> => {
  const connection = await fetchConnection()
  return connection && connection.isConnected ? connection.close() : undefined
}
