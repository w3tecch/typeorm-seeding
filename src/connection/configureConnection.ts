import type { ConnectionConfiguration } from '../types'
import { ConnectionConfigurationManager } from './ConnectionConfigurationManager'

export function configureConnection(options: Partial<ConnectionConfiguration> = {}) {
  ConnectionConfigurationManager.getInstance().overrideConfiguration(options)
}
