import type { ConnectionConfiguration } from '../types'

export class ConnectionConfigurationManager {
  private static _instance: ConnectionConfigurationManager
  private _configuration: ConnectionConfiguration

  private constructor() {
    this._configuration = {
      connection: 'default',
    }
  }

  static getInstance() {
    if (!ConnectionConfigurationManager._instance) {
      ConnectionConfigurationManager._instance = new ConnectionConfigurationManager()
    }

    return ConnectionConfigurationManager._instance
  }

  get configuration(): ConnectionConfiguration {
    return this._configuration
  }

  overrideConfiguration(configuration: Partial<ConnectionConfiguration>) {
    this._configuration = { ...this._configuration, ...configuration }
  }
}
