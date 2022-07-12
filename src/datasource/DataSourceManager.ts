import type { DataSource } from 'typeorm'
import { DataSourceNotProvidedError } from '../errors'

export class DataSourceManager {
  private static _instance: DataSourceManager
  private _dataSource?: DataSource

  static getInstance() {
    if (!DataSourceManager._instance) {
      DataSourceManager._instance = new DataSourceManager()
    }

    return DataSourceManager._instance
  }

  get dataSource(): DataSource {
    if (this._dataSource === undefined) {
      throw new DataSourceNotProvidedError()
    }

    return this._dataSource
  }

  set dataSource(dataSource: DataSource) {
    this._dataSource = dataSource
  }
}
