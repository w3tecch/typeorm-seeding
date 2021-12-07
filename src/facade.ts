import { Connection } from 'typeorm'
import { configureConnection, fetchConnection, getConnectionOptions } from './connection'
import { factory } from './factoriesMap'
import { Seeder } from './seeder'
import { ClassConstructor, ConnectionConfiguration } from './types'
import { calculateFilePaths } from './utils/fileHandling'

export const runSeeder = async (clazz: ClassConstructor<any>) => {
  const seeder = new clazz()
  if (seeder instanceof Seeder) {
    const connection = await fetchConnection()
    seeder.run(factory, connection)
  }
}

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

// TODO: Add seeder execution
/* istanbul ignore next */
export const useSeeding = async (options?: Partial<ConnectionConfiguration>): Promise<void> => {
  await configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = calculateFilePaths(option.seeds)
  await Promise.all(factoryFiles.map((factoryFile) => import(factoryFile)))
}
