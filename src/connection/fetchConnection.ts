import { Connection, createConnection, getConnection } from 'typeorm'
import { ConnectionConfigurationManager } from './ConnectionConfigurationManager'
import { getConnectionOptions } from './getConnectionOptions'

export const fetchConnection = async (): Promise<Connection> => {
  const { connection: connectionName } = ConnectionConfigurationManager.getInstance().configuration

  const getNewConnection = async (): Promise<Connection> => createConnection(await getConnectionOptions())

  let connection: Connection
  try {
    connection = getConnection(connectionName)
    if (connection.isConnected) return connection

    return getNewConnection()
  } catch {
    return getNewConnection()
  }
}
