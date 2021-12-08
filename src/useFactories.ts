import { configureConnection, getConnectionOptions } from './connection'
import { FactoryImportationError } from './errors/FactoryImportationError'
import { ConnectionConfiguration } from './types'
import { calculateFilePaths } from './utils/fileHandling'

export async function useFactories(options?: Partial<ConnectionConfiguration>): Promise<void>
export async function useFactories(factories?: string[], options?: Partial<ConnectionConfiguration>): Promise<void>

export async function useFactories(
  factoriesOrOptions?: string[] | Partial<ConnectionConfiguration>,
  options?: Partial<ConnectionConfiguration>,
) {
  const factories = Array.isArray(factoriesOrOptions) ? factoriesOrOptions : undefined
  const customOptions = Array.isArray(factoriesOrOptions) ? options : factoriesOrOptions

  await configureConnection(customOptions)
  const option = await getConnectionOptions()

  let factoryFiles = calculateFilePaths(option.factories)
  if (factories) {
    const factoriesDesired = calculateFilePaths(factories)
    factoryFiles = factoryFiles.filter((factoryFile) => factoriesDesired.includes(factoryFile))
  }

  try {
    await Promise.all(factoryFiles.map((factoryFile) => import(factoryFile)))
  } catch (error: any) {
    throw new FactoryImportationError(error.message)
  }
}
