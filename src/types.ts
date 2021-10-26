import * as Faker from 'faker'
import { ObjectType } from 'typeorm'

import { EntityFactory } from './entity-factory'

/**
 * FactoryFunction is the fucntion, which generate a new filled entity
 */
export type FactoryFunction<Entity, Context> = (faker: typeof Faker, context?: Context) => Entity

/**
 * Factory gets the EntityFactory to the given Entity and pass the context along
 */
export type Factory = <Entity, Context>(
  entity: ObjectType<Entity>,
) => (context?: Context) => EntityFactory<Entity, Context>

/**
 * Constructor of the seed class
 */
export type ClassConstructor<T> = new () => T

/**
 * Value of our EntityFactory state
 */
export interface EntityFactoryDefinition<Entity, Context> {
  entity: ObjectType<Entity>
  factory: FactoryFunction<Entity, Context>
}
