import { resolve } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

interface SeedingOptions {
  factories: string[]
  seeds: string[]
}

export declare type ConnectionOptions = DataSourceOptions & SeedingOptions

export interface ConfigureOption {
  dataSourcePath?: string
}

const KEY = 'TypeORM_Seeding_Connection'

if ((global as any)[KEY] === undefined) {
  ;(global as any)[KEY] = {
    dataSource: undefined as DataSource | undefined,
    dataSourcePath: undefined as string | undefined,
    ormConfig: undefined,
    connection: undefined,
    overrideConnectionOptions: {
      factories: [process.env.TYPEORM_SEEDING_FACTORIES || 'src/database/factories/**/*{.ts,.js}'],
      seeds: [process.env.TYPEORM_SEEDING_SEEDS || 'src/database/seeds/**/*{.ts,.js}'],
    } as ConnectionOptions,
  }
}

export const configureConnection = (option: ConfigureOption = {}) => {
  ;(global as any)[KEY] = {
    ...(global as any)[KEY],
    ...option,
  }
}

export const setConnectionOptions = (options: Partial<ConnectionOptions>): void => {
  ;(global as any)[KEY].overrideConnectionOptions = {
    ...(global as any)[KEY].overrideConnectionOptions,
    ...options,
  }
}

export const getConnectionOptions = async (): Promise<ConnectionOptions> => {
  return (global as any)[KEY].overrideConnectionOptions
}

export const resetDataSource = async () => {
  ;(global as any)[KEY].overrideConnectionOptions = {}
  const ds = (global as any)[KEY].dataSource as DataSource
  if (ds) {
    ;(global as any)[KEY].dataSource = undefined
    return ds && ds.isInitialized ? ds.destroy() : undefined
  }
}

export const loadDataSource = async (options?: DataSourceOptions): Promise<DataSource> => {
  const { dataSourcePath, dataSource, overrideConnectionOptions } = (global as any)[KEY]

  let ds: DataSource | undefined
  if (!dataSource) {
    if (dataSourcePath) {
      ds = (await require(resolve(process.cwd(), dataSourcePath))).default as DataSource
      ds.setOptions({ ...overrideConnectionOptions, ...options })
    } else {
      ds = new DataSource({ ...overrideConnectionOptions, ...options })
    }
    await ds.initialize()
    ;(global as any)[KEY].dataSource = ds
  }

  return (global as any)[KEY].dataSource
}
