import type { ConnectionOptions as TypeORMConnectionOptions } from 'typeorm'

export type ClassConstructor<T> = new () => T

export type ConnectionOptions = TypeORMConnectionOptions & {
  seeders: string[]
  defaultSeeder: string
}

export type ConnectionConfiguration = {
  root?: string
  configName?: string
  connection: string
}
