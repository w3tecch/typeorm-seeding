import { resolve } from 'node:path'
import ora from 'ora'
import { DataSource } from 'typeorm'
import { Arguments, Argv, CommandModule, exit } from 'yargs'
import { Seeder } from '../seeder'
import { useSeeders } from '../helpers/useSeeders'
import { calculateFilePath } from '../utils/fileHandling'
import type { Constructable } from '../types'

interface SeedCommandArguments extends Arguments {
  dataSource?: string
  path?: string
}

export class SeedCommand implements CommandModule {
  command = 'seed <path>'
  describe = 'Runs the seeders'

  /**
   * @inheritdoc
   */
  builder(args: Argv) {
    return args.option('d', {
      alias: 'dataSource',
      type: 'string',
      describe: 'Path to the file where your DataSource instance is defined.',
      required: true,
    })
  }

  /**
   * @inheritdoc
   */
  async handler(args: SeedCommandArguments) {
    const spinner = ora({ isSilent: process.env.NODE_ENV === 'test' }).start()

    spinner.start('Loading datasource')
    let dataSource!: DataSource
    try {
      const dataSourcePath = resolve(process.cwd(), args.dataSource as string)

      dataSource = await SeedCommand.loadDataSource(dataSourcePath)

      spinner.succeed('Datasource loaded')
    } catch (error) {
      await SeedCommand.handleDatasourceError(spinner, error as Error, dataSource)
    }

    spinner.start('Importing seeders')
    let seeders!: Constructable<Seeder>[]
    try {
      const absolutePath = resolve(process.cwd(), args.path as string)
      const seederFiles = calculateFilePath(absolutePath)

      seeders = await SeedCommand.loadSeeders(seederFiles)

      spinner.succeed('Seeder imported')
    } catch (error) {
      await SeedCommand.handleSeedersError(spinner, error as Error, dataSource)
    }

    // Run seeder
    spinner.start(`Executing seeders`)
    try {
      for (const seeder of seeders) {
        await useSeeders(seeder)
        spinner.succeed(`Seeder ${seeder.name} executed`)
      }
    } catch (error) {
      await SeedCommand.handleSeederExecutionError(spinner, error as Error, dataSource)
    }

    spinner.succeed('Finished seeding')
    await dataSource.destroy()
  }

  static async handleDatasourceError(spinner: ora.Ora, error: Error, dataSource: DataSource | undefined) {
    spinner.fail('Could not load the data source!')
    console.error(error.message)
    if (dataSource) {
      await dataSource.destroy()
    }
    exit(1, error)
  }

  static async loadDataSource(dataSourceFilePath: string): Promise<DataSource> {
    let dataSourceFileExports
    try {
      dataSourceFileExports = await import(dataSourceFilePath)
    } catch (err) {
      throw new Error(`Unable to open file: "${dataSourceFilePath}"`)
    }

    if (!dataSourceFileExports || typeof dataSourceFileExports !== 'object') {
      throw new Error(`Given data source file must contain export of a DataSource instance`)
    }

    const dataSourceExports: DataSource[] = []
    for (const fileExport in dataSourceFileExports) {
      const dataSourceExport = dataSourceFileExports[fileExport]
      if (dataSourceExport instanceof DataSource) {
        dataSourceExports.push(dataSourceExport)
      }
    }

    if (dataSourceExports.length === 0) {
      throw new Error(`Given data source file must contain export of a DataSource instance`)
    }
    if (dataSourceExports.length > 1) {
      throw new Error(`Given data source file must contain only one export of DataSource instance`)
    }

    const dataSource = dataSourceExports[0]
    dataSource.setOptions({
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: false,
    })
    await dataSource.initialize()

    return dataSource
  }

  static async handleSeedersError(spinner: ora.Ora, error: Error, dataSource: DataSource) {
    spinner.fail('Could not load seeders!')
    console.error(error.message)
    await dataSource.destroy()
    exit(1, error)
  }

  static async loadSeeders(seederPaths: string[]): Promise<Constructable<Seeder>[]> {
    let defaultSeeders
    try {
      defaultSeeders = await Promise.all(seederPaths.map((seederFile) => import(seederFile))).then((seederExports) => {
        return seederExports.map((seederExport) => seederExport.default)
      })
    } catch (err) {
      throw new Error(`Unable to open files ${(err as Error).message}`)
    }

    return defaultSeeders
  }

  static async handleSeederExecutionError(spinner: ora.Ora, error: Error, dataSource: DataSource) {
    spinner.fail('Could not execute seeder!')
    console.error(error.message)
    await dataSource.destroy()
    exit(1, error)
  }
}
