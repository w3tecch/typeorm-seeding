import type { ConnectionOptions as TypeORMConnectionOptions } from 'typeorm'
import type { Factory } from './factory'

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
export type FactorizedAttrs<T> = {
  [K in keyof Partial<T>]: T[K] | (() => T[K] | Promise<T[K]>) | Factory<T[K]>
}
export type LazyAttributeCallback<T> = (entity: T) => FactorizedAttrs<T>
