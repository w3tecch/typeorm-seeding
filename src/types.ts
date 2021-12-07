import * as Faker from 'faker'
import { ObjectType } from 'typeorm'
import { Factory } from './factory'

/**
 * FactoryFunction is the function, which generate a new filled entity
 */
export type FactoryFunction<Entity, Context> = (faker: typeof Faker, context?: Context) => Entity

/**
 * Factory gets the EntityFactory to the given Entity and pass the context along
 */
export type ContextFactoryFunction = <Entity, Context>(
  entity: ObjectType<Entity>,
) => (context?: Context) => Factory<Entity, Context>

/**
 * Constructor of the seed class
 */
export type ClassConstructor<T> = new () => T
