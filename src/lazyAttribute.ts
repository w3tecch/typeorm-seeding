import type { FactorizedAttrs, LazyAttributeCallback } from './types'

export class LazyAttribute<T> {
  constructor(private callback: LazyAttributeCallback<T>) {}

  resolve(entity: T): FactorizedAttrs<T> {
    return this.callback(entity)
  }
}
