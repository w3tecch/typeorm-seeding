import { ConnectionOptionsReader } from 'typeorm'
import { DefaultSeederNotDefinedError } from '../errors'
import type { ConnectionOptions } from '../types'
import { ConnectionConfigurationManager } from './ConnectionConfigurationManager'

export async function getConnectionOptions(): Promise<ConnectionOptions> {
  const { root, configName, connection } = ConnectionConfigurationManager.getInstance().configuration
  const connectionReader = new ConnectionOptionsReader({
    root,
    configName,
  })

  const options = (await connectionReader.get(connection)) as ConnectionOptions

  const seedersFromEnv = process.env.TYPEORM_SEEDING_SEEDERS
  const defaultSeederFromEnv = process.env.TYPEORM_SEEDING_DEFAULT_SEEDER
  const defaultSeeder = defaultSeederFromEnv || options.defaultSeeder

  if (!defaultSeeder) {
    throw new DefaultSeederNotDefinedError()
  }

  return {
    ...options,
    seeders: seedersFromEnv ? [seedersFromEnv] : options.seeders || [],
    defaultSeeder,
  }
}
