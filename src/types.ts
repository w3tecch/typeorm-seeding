import type { ConnectionOptions as TypeORMConnectionOptions } from 'typeorm'

/**
 * Constructor of the seed class
 */
export type ClassConstructor<T> = new () => T

export type ConnectionOptions = TypeORMConnectionOptions & {
  seeders: string[]
}

export type ConnectionConfiguration = {
  root?: string
  configName?: string
  connection: string
}
