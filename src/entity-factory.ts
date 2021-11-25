import * as Faker from 'faker'
import { ObjectType, SaveOptions, Entity, createConnection } from 'typeorm'
import { FactoryFunction } from './types'
import { isPromiseLike } from './utils/factory.util'
import { printError, printWarning } from './utils/log.util'
import { getConnectionOptions } from './connection'

export class EntityFactory<Entity, Context> {
  private mapFunction?: (entity: Entity) => Promise<Entity>

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
  public async make(overrideParams: Partial<Entity> = {}): Promise<Entity> {
    return this.makeEntity(overrideParams, false)
  }

  /**
   * Create makes a new entity and does persist it
   */
  public async create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity> {
    const option = await getConnectionOptions()
    const connection = await createConnection(option)
    if (connection && connection.isConnected) {
      const em = connection.createEntityManager()
      try {
        const entity = await this.makeEntity(overrideParams, true)
        return await em.save<Entity>(entity, saveOptions)
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

  public async makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  public async createMany(
    amount: number,
    overrideParams: Partial<Entity> = {},
    saveOptions?: SaveOptions,
  ): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }

  // -------------------------------------------------------------------------
  // Private Helpers
  // -------------------------------------------------------------------------

  private async makeEntity(overrideParams: Partial<Entity> = {}, isSeeding = false): Promise<Entity> {
    if (!this.factory) {
      throw new Error('Could not found entity')
    }

    let entity = this.factory(Faker, this.context)

    if (this.mapFunction) {
      entity = await this.mapFunction(entity)
    }

    for (const key in overrideParams) {
      const actualValue = entity[key]
      entity[key] = overrideParams[key] as typeof actualValue
    }
    return await this.resolveEntity(entity, isSeeding)
  }

  private async resolveEntity(entity: Entity, isSeeding = false): Promise<Entity> {
    for (const attribute in entity) {
      const attributeValue = entity[attribute]

      if (isPromiseLike(attributeValue)) {
        entity[attribute] = await attributeValue
      }

      if (attributeValue instanceof EntityFactory) {
        try {
          if (isSeeding) {
            entity[attribute] = await attributeValue.create()
          } else {
            entity[attribute] = await attributeValue.make()
          }
        } catch (error) {
          const message = `Could not make ${attributeValue.name}`
          printError(message, error)
          throw new Error(message)
        }
      }
    }
    return entity
  }
}
