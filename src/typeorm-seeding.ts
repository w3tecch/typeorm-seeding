import 'reflect-metadata'
import { ObjectType, DataSource, ObjectLiteral } from 'typeorm'

import { EntityFactory } from './entity-factory'
import { EntityFactoryDefinition, Factory, FactoryFunction, SeederConstructor, Seeder } from './types'
import { getNameOfEntity } from './utils/factory.util'
import { loadFiles, importFiles } from './utils/file.util'
import {
  ConfigureOption,
  configureConnection,
  getConnectionOptions,
  loadDataSource,
  resetDataSource,
} from './connection'

// -------------------------------------------------------------------------
// Handy Exports
// -------------------------------------------------------------------------

export * from './importer'
export * from './connection'
export { Factory, Seeder } from './types'
export { times } from './helpers'

// -------------------------------------------------------------------------
// Types & Variables
// -------------------------------------------------------------------------
;(global as any).seeder = {
  entityFactories: new Map<string, EntityFactoryDefinition<any, any>>(),
}

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

export const define = <Entity extends ObjectLiteral, Context>(
  entity: ObjectType<Entity>,
  factoryFn: FactoryFunction<Entity, Context>,
) => {
  ;(global as any).seeder.entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  })
}

export const factory: Factory =
  <Entity extends ObjectLiteral, Context>(entity: ObjectType<Entity>) =>
  (context?: Context) => {
    const name = getNameOfEntity(entity)
    const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
    return new EntityFactory<Entity, Context>(name, entity, entityFactoryObject.factory, context)
  }

export const runSeeder = async (clazz: SeederConstructor): Promise<any> => {
  const seeder: Seeder = new clazz()
  const dataSource = await loadDataSource()
  return seeder.run(factory, dataSource)
}

// -------------------------------------------------------------------------
// Facade functions for testing
// -------------------------------------------------------------------------
export const useRefreshDatabase = async (options: ConfigureOption = {}): Promise<DataSource> => {
  configureConnection(options)
  const dataSource = await loadDataSource()
  if (dataSource && dataSource.isInitialized) {
    await dataSource.dropDatabase()
    await dataSource.synchronize()
  }
  return dataSource
}

export const tearDownDatabase = async (): Promise<void> => {
  return resetDataSource()
}

export const useSeeding = async (options: ConfigureOption = {}): Promise<void> => {
  configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = loadFiles(option.factories)
  await importFiles(factoryFiles)
}
