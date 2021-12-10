import { ConnectionOptionsReader } from 'typeorm'
import { ConnectionOptions } from '../types'
import { ConnectionConfigurationManager } from './ConnectionConfigurationManager'

export async function getConnectionOptions(): Promise<ConnectionOptions> {
  const { root, configName, connection } = ConnectionConfigurationManager.getInstance().configuration
  const connectionReader = new ConnectionOptionsReader({
    root,
    configName,
  })

  const options = (await connectionReader.get(connection)) as ConnectionOptions

  const factoriesFromEnv = process.env.TYPEORM_SEEDING_FACTORIES
  const seedersFromEnv = process.env.TYPEORM_SEEDING_SEEDS

  return {
    ...options,
    factories: factoriesFromEnv ? [factoriesFromEnv] : options.factories || [],
    seeds: seedersFromEnv ? [seedersFromEnv] : options.seeds || [],
  }
}
