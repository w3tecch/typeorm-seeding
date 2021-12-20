import * as Faker from 'faker'
import { SaveOptions } from 'typeorm'
import { fetchConnection } from './connection'
import { isPromiseLike } from './utils/isPromiseLike'

export abstract class Factory<Entity> {
  private mapFunction?: (entity: Entity) => void
  protected abstract definition(): Entity

  /**
   * This function is used to alter the generated values of entity, before it
   * is persist into the database
   */
  map(mapFunction: (entity: Entity) => void) {
    this.mapFunction = mapFunction
    return this
  }

  /**
   * Make a new entity without persisting it
   */
  async make(overrideParams: Partial<Entity> = {}): Promise<Entity> {
    return this.makeEntity(overrideParams, false)
  }

  /**
   * Make many new entities without persisting it
   */
  async makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  /**
   * Create a new entity and persist it
   */
  async create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity> {
    const entity = await this.makeEntity(overrideParams, true)

    const connection = await fetchConnection()
    return connection.createEntityManager().save<Entity>(entity, saveOptions)
  }

  /**
   * Create many new entities and persist them
   */
  async createMany(amount: number, overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }

  private async makeEntity(overrideParams: Partial<Entity>, isSeeding: boolean) {
    const entity = this.definition()

    if (this.mapFunction) this.mapFunction(entity)

    for (const key in overrideParams) {
      const actualValue = entity[key]
      entity[key] = overrideParams[key] as typeof actualValue
    }

    return this.resolveEntity(entity, isSeeding)
  }

  private async resolveEntity(entity: Entity, isSeeding: boolean): Promise<Entity> {
    for (const attribute in entity) {
      const attributeValue = entity[attribute]

      if (isPromiseLike(attributeValue)) {
        entity[attribute] = await attributeValue
      }

      if (attributeValue instanceof Factory) {
        if (isSeeding) {
          entity[attribute] = await attributeValue.create()
        } else {
          entity[attribute] = await attributeValue.make()
        }
      }
    }
    return entity
  }
}
