import type { DataSource } from 'typeorm'
import { DataSourceManager } from './DataSourceManager'

export function configureDataSource(dataSource: DataSource) {
  DataSourceManager.getInstance().dataSource = dataSource
}
