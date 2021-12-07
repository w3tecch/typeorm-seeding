import { configureConnection, getConnectionOptions } from './connection'
import { ConnectionConfiguration } from './types'
import { calculateFilePaths } from './utils/fileHandling'

export const useFactories = async (options?: Partial<ConnectionConfiguration>): Promise<void> => {
  await configureConnection(options)
  const option = await getConnectionOptions()
  const factoryFiles = calculateFilePaths(option.factories)
  await Promise.all(factoryFiles.map((factoryFile) => import(factoryFile))) // TODO: Add error handling here
}
