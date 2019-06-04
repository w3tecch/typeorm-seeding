import 'reflect-metadata'
import { Connection, ObjectType } from 'typeorm'

import { EntityFactory } from './entity-factory'
import { EntityFactoryDefinition, Factory, FactoryFunction, SeederConstructor, Seeder } from './types'
import { getNameOfEntity } from './utils/factory.util'

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

/**
 * Adds the typorm connection to the seed options
 */
export const setConnection = (connection: Connection) => ((global as any).seeder.connection = connection)

/**
 * Returns the typorm connection from our seed options
 */
export const getConnection = () => (global as any).seeder.connection

/**
 * Defines a new entity factory
 */
export const define = <Entity, Settings>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Settings>) => {
  ;(global as any).seeder.entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  })
}

/**
 * Gets a defined entity factory and pass the settigns along to the entity factory function
 */
export const factory: Factory = <Entity, Settings>(entity: ObjectType<Entity>) => (settings?: Settings) => {
  const name = getNameOfEntity(entity)
  const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
  return new EntityFactory<Entity, Settings>(name, entity, entityFactoryObject.factory, settings)
}

/**
 * Runs a seed class
 */
export const runSeed = async (clazz: SeederConstructor): Promise<void> => {
  const seeder: Seeder = new clazz()
  return seeder.run(factory, getConnection())
}
