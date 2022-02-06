import type { Factory } from './factory'
import type { Constructable, FactorizedAttrs } from './types'

export class Subfactory<T> {
  private factoryInstance: Factory<T>
  private values?: Partial<FactorizedAttrs<T>>
  private count?: number

  constructor(factory: Constructable<Factory<T>>)
  constructor(factory: Constructable<Factory<T>>, values?: Partial<FactorizedAttrs<T>>)
  constructor(factory: Constructable<Factory<T>>, count?: number)
  constructor(factory: Constructable<Factory<T>>, values?: Partial<FactorizedAttrs<T>>, count?: number)

  constructor(
    factory: Constructable<Factory<T>>,
    countOrValues?: Partial<FactorizedAttrs<T>> | number,
    count?: number,
  ) {
    this.factoryInstance = new factory()
    this.values = typeof countOrValues === 'number' ? undefined : countOrValues
    this.count = typeof countOrValues === 'number' ? countOrValues : count
  }

  create() {
    if (this.count !== undefined) {
      return this.factoryInstance.createMany(this.count, this.values)
    }

    return this.factoryInstance.create(this.values)
  }

  make() {
    if (this.count !== undefined) {
      return this.factoryInstance.makeMany(this.count, this.values)
    }

    return this.factoryInstance.make(this.values)
  }
}
