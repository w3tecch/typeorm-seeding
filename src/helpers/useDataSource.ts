import type { DataSource, DataSourceOptions } from 'typeorm'
import { configureDataSource } from '../datasource'

export async function useDataSource(dataSource: DataSource): Promise<void>
export async function useDataSource(dataSource: DataSource, overrideOptions: Partial<DataSourceOptions>): Promise<void>
export async function useDataSource(dataSource: DataSource, forceInitialization: boolean): Promise<void>
export async function useDataSource(
  dataSource: DataSource,
  overrideOptions: Partial<DataSourceOptions>,
  forceInitialization: boolean,
): Promise<void>

export async function useDataSource(
  dataSource: DataSource,
  overrideOptionsOrForceInitialization?: Partial<DataSourceOptions> | boolean,
  forceInitialization?: boolean,
): Promise<void> {
  const overrideOptions =
    typeof overrideOptionsOrForceInitialization === 'object' ? overrideOptionsOrForceInitialization : undefined
  const shouldInitilialize =
    typeof overrideOptionsOrForceInitialization === 'boolean'
      ? overrideOptionsOrForceInitialization
      : forceInitialization

  if (overrideOptions) {
    dataSource.setOptions(overrideOptions)
  }

  if (shouldInitilialize) {
    await dataSource.initialize()
  }

  configureDataSource(dataSource)
}
