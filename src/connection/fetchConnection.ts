import { Connection, createConnection, getConnection } from 'typeorm'
import { ConnectionOptions } from '../types'
import { ConnectionConfigurationManager } from './ConnectionConfigurationManager'
import { getConnectionOptions } from './getConnectionOptions'

export const fetchConnection = async (): Promise<Connection> => {
  const { connection: connectionName } = ConnectionConfigurationManager.getInstance().configuration

  try {
    return getConnection(connectionName)
  } catch {
    return createConnection((await getConnectionOptions()) as ConnectionOptions)
  }
}
