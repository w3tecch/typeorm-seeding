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
    option.factories = [process.env.TYPEORM_SEEDING_FACTORIES as string]
  }
  if (!option.seeds) {
    option.seeds = [process.env.TYPEORM_SEEDING_SEEDS as string]
  }
  return option
}

export const getConnectionOption = async (
  option: ConnectionOptionArguments,
  name: string,
): Promise<ConnectionOptions> => {
  const reader = new ConnectionOptionsReader(option)
  const options = (await reader.all()) as any[]
  if (options.length === 1) {
    return attachSeedingOptions(options[0])
  }
  if (name !== undefined && name !== '') {
    const filteredOptions = options.filter((o) => o.name === name)
    if (filteredOptions.length === 1) {
      return attachSeedingOptions(options[0])
    } else {
      printError('Could not find any connection with the name=', name)
    }
  }
  printError('There are multiple connections please provide a connection name')
}

export const createConnection = async (option: ConnectionOptionArguments, name: string): Promise<Connection> => {
  const connectionOption = await getConnectionOption(option, name)
  return createTypeORMConnection(connectionOption)
}
