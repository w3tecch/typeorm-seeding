import type { SaveOptions } from 'typeorm'
import { fetchDataSource } from './datasource'
import { InstanceAttribute } from './instanceAttribute'
import { LazyInstanceAttribute } from './lazyInstanceAttribute'
import { Subfactory } from './subfactory'
import type { Constructable, FactorizedAttrs } from './types'

export abstract class Factory<T> {
  protected abstract entity: Constructable<T>
  protected abstract attrs(): FactorizedAttrs<T>

  /**
   * Make a new entity without persisting it
   */
  async make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T> {
    const attrs = { ...this.attrs(), ...overrideParams }

    const entity = await this.makeEntity(attrs, false)
    await this.applyLazyAttributes(entity, attrs, false)

    return entity
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
    const attrs = { ...this.attrs(), ...overrideParams }
    const preloadedAttrs = Object.entries(attrs).filter(([, value]) => !(value instanceof LazyInstanceAttribute))

    const entity = await this.makeEntity(Object.fromEntries(preloadedAttrs) as FactorizedAttrs<T>, true)

    const em = fetchDataSource().createEntityManager()
    const savedEntity = await em.save<T>(entity, saveOptions)

    await this.applyLazyAttributes(savedEntity, attrs, true)
    return em.save<T>(savedEntity, saveOptions)
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

  private async makeEntity(attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
    const entity = new this.entity()

    await Promise.all(
      Object.entries(attrs).map(async ([key, value]) => {
        Object.assign(entity, { [key]: await Factory.resolveValue(value, shouldPersist) })
      }),
    )

    await Promise.all(
      Object.entries(attrs).map(async ([key, value]) => {
        if (value instanceof InstanceAttribute) {
          const newAttrib = value.resolve(entity)
          Object.assign(entity, { [key]: await Factory.resolveValue(newAttrib, shouldPersist) })
        }
      }),
    )

    return entity
  }

  private async applyLazyAttributes(entity: T, attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
    await Promise.all(
      Object.entries(attrs).map(async ([key, value]) => {
        if (value instanceof LazyInstanceAttribute) {
          const newAttrib = value.resolve(entity)
          Object.assign(entity, { [key]: await Factory.resolveValue(newAttrib, shouldPersist) })
        }
      }),
    )
  }

  private static resolveValue(value: unknown, shouldPersist: boolean) {
    if (value instanceof Subfactory) {
      return shouldPersist ? value.create() : value.make()
    } else if (value instanceof Function) {
      return value()
    } else {
      return value
    }
  }
}
