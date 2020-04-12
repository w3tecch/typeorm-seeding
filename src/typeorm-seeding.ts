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

export const setConnection = (connection: Connection) => ((global as any).seeder.connection = connection)

export const getConnection = () => (global as any).seeder.connection

export const define = <Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) => {
  ;(global as any).seeder.entityFactories.set(getNameOfEntity(entity), {
    entity,
    factory: factoryFn,
  })
}

export const factory: Factory = <Entity, Context>(entity: ObjectType<Entity>) => (context?: Context) => {
  const name = getNameOfEntity(entity)
  const entityFactoryObject = (global as any).seeder.entityFactories.get(name)
  return new EntityFactory<Entity, Context>(name, entity, entityFactoryObject.factory, context)
}

export const runSeeder = async (clazz: SeederConstructor): Promise<void> => {
  const seeder: Seeder = new clazz()
  return seeder.run(factory, getConnection())
}
