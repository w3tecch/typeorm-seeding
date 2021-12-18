import * as Faker from 'faker'
import { ConnectionOptions as TypeORMConnectionOptions, ObjectType } from 'typeorm'
import { Factory } from './factory'

/**
 * FactoryFunction is the function, which generate a new filled entity
 */
export type FactoryFunction<Entity> = (faker: typeof Faker) => Entity

/**
 * Factory gets the EntityFactory to the given Entity and pass the context along
 */
export type EntityFactory = <Entity>(entity: ObjectType<Entity>) => Factory<Entity>

/**
 * Constructor of the seed class
 */
export type ClassConstructor<T> = new () => T

export type ConnectionOptions = TypeORMConnectionOptions & {
  factories: string[]
  seeds: string[]
}

export type ConnectionConfiguration = {
  root?: string
  configName?: string
  connection: string
}
