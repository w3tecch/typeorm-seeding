import type { ConnectionOptions as TypeORMConnectionOptions } from 'typeorm'
import type { LazyAttribute } from './lazyAttribute'
import type { Subfactory } from './subfactory'

export type ConnectionOptions = TypeORMConnectionOptions & {
  seeders: string[]
  defaultSeeder: string
}
export type ConnectionConfiguration = {
  root?: string
  configName?: string
  connection: string
}
export type Constructable<T> = new () => T
export type FactorizedAttr<V> = V | (() => V | Promise<V>) | Subfactory<V extends Array<infer U> ? U : V>
export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: FactorizedAttr<T[K]> | LazyAttribute<T, T[K]>
}
export type LazyAttributeCallback<T, V> = (entity: T) => FactorizedAttr<V>
