import 'reflect-metadata'
import { ObjectType, getConnection, Connection, createConnection } from 'typeorm'

import { EntityFactory } from './entity-factory'
import { ClassConstructor, EntityFactoryDefinition, Factory, FactoryFunction } from './types'
import { getNameOfEntity } from './utils/factory.util'
import { loadFilePaths, importFiles } from './utils/file.util'
import { configureConnection, getConnectionOptions, ConnectionConfiguration } from './connection'
import { Seeder } from './seeder'

// -------------------------------------------------------------------------
// Handy Exports
// -------------------------------------------------------------------------

export * from './importer'
export * from './connection'
export { Seeder } from './seeder'
export { Factory } from './types'

// -------------------------------------------------------------------------
// Types & Variables
// -------------------------------------------------------------------------
;(global as any).seeder = {
  entityFactories: new Map<string, EntityFactoryDefinition<any, any>>(),
}

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

export const define = <Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) => {
  ;(global as any).seeder.entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  })
}

export const factory: Factory =
  <Entity, Context>(entity: ObjectType<Entity>) =>
  (context?: Context) => {
    const name = getNameOfEntity(entity)
    const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
    return new EntityFactory<Entity, Context>(name, entity, entityFactoryObject.factory, context)
  }

export const runSeeder = async (clazz: ClassConstructor<any>): Promise<void> => {
  const seeder = new clazz()
  if (seeder instanceof Seeder) {
    const connection = await createConnection()
    seeder.run(factory, connection)
  }
}

// -------------------------------------------------------------------------
// Facade functions for testing
// -------------------------------------------------------------------------

export const useRefreshDatabase = async (options: ConnectionConfiguration = {}): Promise<Connection> => {
  configureConnection(options)
  const option = await getConnectionOptions()
  const connection = await createConnection(option)
  if (connection && connection.isConnected) {
    await connection.dropDatabase()
    await connection.synchronize()
  }
  return connection
}

export const tearDownDatabase = async (): Promise<void> => {
  const connection = await createConnection()
  return connection && connection.isConnected ? connection.close() : undefined
}

export const useSeeding = async (options: ConnectionConfiguration = {}): Promise<void> => {
  configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = loadFilePaths(option.factories)
  await importFiles(factoryFiles)
}
