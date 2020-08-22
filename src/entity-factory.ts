import * as Faker from 'faker'
import { ObjectType } from 'typeorm'
import { FactoryFunction, EntityProperty } from './types'
import { isPromiseLike } from './utils/factory.util'
import { printError, printWarning } from './utils/log.util'
import { getConnectionOptions, createConnection } from './connection'

export class EntityFactory<Entity, Context> {
  private mapFunction: (entity: Entity) => Promise<Entity>

  constructor(
    public name: string,
    public entity: ObjectType<Entity>,
    private factory: FactoryFunction<Entity, Context>,
    private context?: Context,
  ) {}

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * This function is used to alter the generated values of entity, before it
   * is persist into the database
   */
  public map(mapFunction: (entity: Entity) => Promise<Entity>): EntityFactory<Entity, Context> {
    this.mapFunction = mapFunction
    return this
  }

  /**
   * Make a new entity, but does not persist it
   */
  public async make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    return this.makeEnity(overrideParams, false)
  }

  /**
   * Create makes a new entity and does persist it
   */
  public async create(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    const option = await getConnectionOptions()
    const connection = await createConnection(option)
    if (connection && connection.isConnected) {
      const em = connection.createEntityManager()
      try {
        const entity = await this.makeEnity(overrideParams, true)
        return await em.save<Entity>(entity)
      } catch (error) {
        const message = 'Could not save entity'
        printError(message, error)
        throw new Error(message)
      }
    } else {
      const message = 'No db connection is given'
      printError(message)
      throw new Error(message)
    }
  }

  public async makeMany(amount: number, overrideParams: EntityProperty<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  public async createMany(amount: number, overrideParams: EntityProperty<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams)
    }
    return list
  }

  public async seed(overrideParams: EntityProperty<Entity> = {}): Promise<Entity> {
    printWarning('The seed() method is deprecated please use the create() method instead')
    return this.create(overrideParams)
  }

  public async seedMany(amount: number, overrideParams: EntityProperty<Entity> = {}): Promise<Entity[]> {
    printWarning('The seedMany() method is deprecated please use the createMany() method instead')
    return this.createMany(amount, overrideParams)
  }

  // -------------------------------------------------------------------------
  // Prrivat Helpers
  // -------------------------------------------------------------------------

  private async makeEnity(overrideParams: EntityProperty<Entity> = {}, isSeeding = false): Promise<Entity> {
    if (this.factory) {
      let entity = await this.resolveEntity(await this.factory(Faker, this.context), isSeeding)
      if (this.mapFunction) {
        entity = await this.mapFunction(entity)
      }

      for (const key in overrideParams) {
        if (overrideParams.hasOwnProperty(key)) {
          entity[key] = overrideParams[key]
        }
      }

      return entity
    }
    throw new Error('Could not found entity')
  }

  private async resolveEntity(entity: Entity, isSeeding = false): Promise<Entity> {
    for (const attribute in entity) {
      if (entity.hasOwnProperty(attribute)) {
        if (isPromiseLike(entity[attribute])) {
          entity[attribute] = await entity[attribute]
        }
        if (
          entity[attribute] &&
          typeof entity[attribute] === 'object' &&
          entity[attribute].constructor.name === EntityFactory.name
        ) {
          const subEntityFactory = entity[attribute]
          try {
            if (isSeeding) {
              entity[attribute] = await (subEntityFactory as any).create()
            } else {
              entity[attribute] = await (subEntityFactory as any).make()
            }
          } catch (error) {
            const message = `Could not make ${(subEntityFactory as any).name}`
            printError(message, error)
            throw new Error(message)
          }
        }
      }
    }
    return entity
  }
}
