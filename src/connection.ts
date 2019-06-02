import * as path from 'path'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'

const args = process.argv

// Get cli parameter for logging
const logging =
  args.indexOf('--logging') >= 0 || args.indexOf('-L') >= 0 || false

// Get cli parameter for ormconfig.json or another json file
const configParam = '--config'
const hasConfigPath = args.indexOf(configParam) >= 0 || false
const indexOfConfigPath = args.indexOf(configParam) + 1

/**
 * Returns a TypeORM database connection for our entity-manager
 */
export const loadConnection = async (
  configPath: string,
): Promise<Connection> => {
  let ormconfig: any = {
    logging,
  }

  if (hasConfigPath) {
    const configPath = path.join(process.cwd(), args[indexOfConfigPath])
    ormconfig = require(configPath)
  } else {
    try {
      ormconfig = await getConnectionOptions()
    } catch (_) {
      ormconfig = require(path.join(process.cwd(), configPath))
    }
  }

  return createConnection(ormconfig)
}
