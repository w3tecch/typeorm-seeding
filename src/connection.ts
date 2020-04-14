import {
  ConnectionOptionsReader,
  Connection as TypeORMConnection,
  ConnectionOptions as TypeORMConnectionOptions,
  createConnection as TypeORMCreateConnection,
} from 'typeorm'
import { printError } from './utils/log.util'

interface SeedingOptions {
  factories: string[]
  seeds: string[]
}

export declare type ConnectionOptions = TypeORMConnectionOptions & SeedingOptions

export interface ConfigureOption {
  root?: string
  configName?: string
  connection?: string
}

const KEY = 'TypeORM_Seeding_Connection'

const defaultConfigureOption: ConfigureOption = {
  root: process.cwd(),
  configName: '',
  connection: '',
}

if ((global as any)[KEY] === undefined) {
  ;(global as any)[KEY] = {
    configureOption: defaultConfigureOption,
    ormConfig: undefined,
    connection: undefined,
  }
}

export const configureConnection = (option: ConfigureOption = {}) => {
  ;(global as any)[KEY].configureOption = {
    ...defaultConfigureOption,
    ...option,
  }
}

export const getConnectionOptions = async (): Promise<ConnectionOptions> => {
  const ormConfig = (global as any)[KEY].ormConfig
  if (ormConfig === undefined) {
    const configureOption = (global as any)[KEY].configureOption
    const connection = configureOption.connection
    const reader = new ConnectionOptionsReader({
      root: configureOption.root,
      configName: configureOption.configName,
    })
    let options = (await reader.all()) as any[]
    if (connection !== undefined && connection !== '') {
      const filteredOptions = options.filter((o) => o.name === connection)
      if (filteredOptions.length === 1) {
        options = filteredOptions
      }
    }
    if (options.length === 1) {
      const option = options[0]
      if (!option.factories) {
        option.factories = [process.env.TYPEORM_SEEDING_FACTORIES || 'src/database/factories/**/*{.ts,.js}']
      }
      if (!option.seeds) {
        option.seeds = [process.env.TYPEORM_SEEDING_SEEDS || 'src/database/seeds/**/*{.ts,.js}']
      }
      ;(global as any)[KEY].ormConfig = option
      return option
    }
    printError('There are multiple connections please provide a connection name')
  }
  return ormConfig
}

export const createConnection = async (option?: TypeORMConnectionOptions): Promise<TypeORMConnection> => {
  let connection = (global as any)[KEY].connection
  let ormConfig = (global as any)[KEY].ormConfig

  if (option !== undefined) {
    ormConfig = option
  }

  if (connection === undefined) {
    connection = await TypeORMCreateConnection(ormConfig)
    ;(global as any)[KEY].connection = connection
  }
  return connection
}
