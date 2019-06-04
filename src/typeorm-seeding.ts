import 'reflect-metadata'
import { Connection, ObjectType, ConnectionOptions } from 'typeorm'

import { EntityFactory } from './entity-factory'
import { EntityFactoryDefinition, Factory, FactoryFunction, SeederConstructor, Seeder } from './types'
import { getNameOfEntity } from './utils/factory.util'
import { getConnectionOptions, createConnection } from './connection'

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
  connection: undefined,
  entityFactories: new Map<string, EntityFactoryDefinition<any, any>>(),
}

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

export const setConnection = (connection: Connection) => ((global as any).seeder.connection = connection)

export const getConnection = () => (global as any).seeder.connection

export const define = <Entity, Settings>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Settings>) => {
  ;(global as any).seeder.entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  })
}

export const factory: Factory = <Entity, Settings>(entity: ObjectType<Entity>) => (settings?: Settings) => {
  const name = getNameOfEntity(entity)
  const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
  return new EntityFactory<Entity, Settings>(name, entity, entityFactoryObject.factory, settings)
}

export const runSeeder = async (clazz: SeederConstructor, configPath?: string): Promise<void> => {
  let connection = getConnection()
  if (!getConnection()) {
    connection = await createConnection(configPath)
    setConnection(connection)
  }

  const seeder: Seeder = new clazz()
  return seeder.run(factory, connection)
}
