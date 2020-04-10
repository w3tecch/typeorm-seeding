import {
  Connection,
  ConnectionOptionsReader,
  createConnection as createTypeORMConnection,
  ConnectionOptions as TypeORMConnectionOptions,
} from 'typeorm'
import { printError } from './utils/log.util'

interface SeedingOptions {
  factories: string[]
  seeds: string[]
}

export interface ConnectionOptionArguments {
  root: string
  configName: string
}

export declare type ConnectionOptions = TypeORMConnectionOptions & SeedingOptions

const attachSeedingOptions = (option: ConnectionOptions): ConnectionOptions => {
  if (!option.factories) {
    const envFactoriesPath = process.env.TYPEORM_SEEDING_FACTORIES
    if (envFactoriesPath) {
      option.factories = [envFactoriesPath]
    } else {
      option.factories = ['src/database/factories/**/*{.ts,.js}']
    }
  }
  if (!option.seeds) {
    const envSeedsPath = process.env.TYPEORM_SEEDING_SEEDS
    if (envSeedsPath) {
      option.seeds = [envSeedsPath]
    } else {
      option.seeds = ['src/database/seeds/**/*{.ts,.js}']
    }
  }
  return option
}

export const getConnectionOption = async (
  option: ConnectionOptionArguments,
  connection: string,
): Promise<ConnectionOptions> => {
  const reader = new ConnectionOptionsReader(option)
  const options = (await reader.all()) as any[]
  if (options.length === 1) {
    return attachSeedingOptions(options[0])
  }
  if (connection !== undefined && connection !== '') {
    const filteredOptions = options.filter((o) => o.name === connection)
    if (filteredOptions.length === 1) {
      return attachSeedingOptions(options[0])
    } else {
      printError('Could not find any connection with the name=', connection)
    }
  }
  printError('There are multiple connections please provide a connection name')
}

export const createConnection = async (option: ConnectionOptionArguments, name: string): Promise<Connection> => {
  const connectionOption = await getConnectionOption(option, name)
  return createTypeORMConnection(connectionOption)
}
