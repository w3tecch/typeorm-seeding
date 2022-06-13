import { DataSourceManager } from './DataSourceManager'

export function fetchDataSource() {
  return DataSourceManager.getInstance().dataSource
}
