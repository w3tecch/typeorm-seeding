import { Connection, ObjectType } from 'typeorm'
import { configureConnection, fetchConnection, getConnectionOptions } from './connection'
import { Factory } from './factory'
import { Seeder } from './seeder'
import { ClassConstructor, ConnectionConfiguration, ContextFactoryFunction, FactoryFunction } from './types'
import { calculateFilePaths } from './utils/fileHandling'
import { getNameOfEntity } from './utils/getNameOfEntity'

const factoriesMap: Map<string, FactoryFunction<any, any>> = new Map()

export const define = <Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) => {
  factoriesMap.set(getNameOfEntity(entity), factoryFn)
}

export const factory: ContextFactoryFunction =
  <Entity, Context>(entity: ObjectType<Entity>) =>
  (context?: Context) => {
    const name = getNameOfEntity(entity)

    const factory = factoriesMap.get(name)
    if (!factory) {
      throw new Error(`Factory for ${name} is not defined`) // TODO: Add custom error
    }

    return new Factory<Entity, Context>(entity, factory, context)
  }

export const runSeeder = async (clazz: ClassConstructor<any>): Promise<void> => {
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

export const useFactories = async (options?: Partial<ConnectionConfiguration>): Promise<void> => {
  await configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = calculateFilePaths(option.factories)
  await Promise.all(factoryFiles.map((factoryFile) => import(factoryFile)))
}

// TODO: Add seeder execution
/* istanbul ignore next */
export const useSeeding = async (options?: Partial<ConnectionConfiguration>): Promise<void> => {
  await configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = calculateFilePaths(option.seeds)
  await Promise.all(factoryFiles.map((factoryFile) => import(factoryFile)))
}
