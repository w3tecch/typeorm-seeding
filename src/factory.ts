import type { SaveOptions } from 'typeorm'
import { fetchConnection } from './connection'
import { LazyAttribute } from './lazyAttribute'
import type { Constructable, FactorizedAttrs } from './types'

export abstract class Factory<T> {
  protected abstract entity: Constructable<T>
  protected abstract attrs: FactorizedAttrs<T>

  /**
   * Make a new entity without persisting it
   */
  async make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T> {
    return this.makeEntity(overrideParams)
  }

  /**
   * Make many new entities without persisting it
   */
  async makeMany(amount: number, overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  /**
   * Create a new entity and persist it
   */
  async create(overrideParams: Partial<FactorizedAttrs<T>> = {}, saveOptions?: SaveOptions): Promise<T> {
    const entity = await this.makeEntity(overrideParams)

    const connection = await fetchConnection()
    return connection.createEntityManager().save<T>(entity, saveOptions)
  }

  /**
   * Create many new entities and persist them
   */
  async createMany(
    amount: number,
    overrideParams: Partial<FactorizedAttrs<T>> = {},
    saveOptions?: SaveOptions,
  ): Promise<T[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }

  private async makeEntity(overrideParams: Partial<FactorizedAttrs<T>>) {
    const entity = new this.entity()
    const attrs = { ...this.attrs, ...overrideParams }

    await Promise.all(
      Object.entries(attrs).map(async ([key, value]) => {
        Object.assign(entity, { [key]: await Factory.resolveValue(value) })
      }),
    )

    await Promise.all(
      Object.entries(attrs).map(async ([key, value]) => {
        if (value instanceof LazyAttribute) {
          const newAttrib = value.resolve(entity)
          Object.assign(entity, { [key]: await Factory.resolveValue(newAttrib) })
        }
      }),
    )

    return entity
  }

  private static resolveValue(value: unknown) {
    if (value instanceof Function) {
      return value()
    } else {
      return value
    }
  }
}
