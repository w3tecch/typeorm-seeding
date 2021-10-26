import * as yargs from 'yargs'
import ora from 'ora'
import chalk from 'chalk'
import { importSeed } from '../importer'
import { loadFilePaths, importFiles } from '../utils/file.util'
import { runSeeder } from '../typeorm-seeding'
import { configureConnection, getConnectionOptions, ConnectionOptions, createConnection } from '../connection'
import { ClassConstructor } from '../types'

export class SeedCommand implements yargs.CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  builder(args: yargs.Argv) {
    return args
      .option('n', {
        alias: 'configName',
        default: '',
        describe: 'Name of the typeorm config file (json or js).',
      })
      .option('c', {
        alias: 'connection',
        default: '',
        describe: 'Name of the typeorm connection',
      })
      .option('r', {
        alias: 'root',
        default: process.cwd(),
        describe: 'Path to your typeorm config file',
      })
      .option('seed', {
        alias: 's',
        describe: 'Specific seed class to run.',
      })
  }

  async handler(args: yargs.Arguments) {
    const log = console.log
    const { default: pkg } = await import('../../package.json')
    log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`))
    const spinner = ora('Loading ormconfig').start()
    const configureOption = {
      root: args.root as string,
      configName: args.configName as string,
      connection: args.connection as string,
    }

    // Get TypeORM config file
    let option: ConnectionOptions
    try {
      configureConnection(configureOption)
      option = await getConnectionOptions()
      spinner.succeed('ORM Config loaded')
    } catch (error) {
      panic(spinner, error as Error, 'Could not load the config file!')
      throw error
    }

    // Find all factories and seed with help of the config
    spinner.start('Import Factories')
    const factoryFiles = loadFilePaths(option.factories)
    try {
      await importFiles(factoryFiles)
      spinner.succeed('Factories are imported')
    } catch (error) {
      panic(spinner, error as Error, 'Could not import factories!')
    }

    // Show seeds in the console
    spinner.start('Importing Seeders')
    const seederFiles = loadFilePaths(option.seeds)
    let classConstructors: ClassConstructor<any>[] = []
    try {
      classConstructors = await Promise.all(seederFiles.map(importSeed))
        .then((classConstructors) => classConstructors.flat())
        .then((classConstructors) =>
          classConstructors.filter(
            (classConstructor) => args.seed === undefined || args.seed === classConstructor.name,
          ),
        )
      spinner.succeed('Seeders are imported')
    } catch (error) {
      panic(spinner, error as Error, 'Could not import seeders!')
    }

    // Get database connection and pass it to the seeder
    spinner.start('Connecting to the database')
    try {
      await createConnection()
      spinner.succeed('Database connected')
    } catch (error) {
      panic(spinner, error as Error, 'Database connection failed! Check your TypeORM config.')
    }

    // Run seeds
    for (const seedFileObject of seedFileObjects) {
      spinner.start(`Executing ${seedFileObject.name} Seeder`)
      try {
        await runSeeder(seedFileObject)
        spinner.succeed(`Seeder ${seedFileObject.name} executed`)
      } catch (error) {
        panic(spinner, error as Error, `Could not run the seed ${seedFileObject.name}!`)
      }
    }

    log('👍 ', chalk.gray.underline(`Finished Seeding`))
    process.exit(0)
  }
}

function panic(spinner: any, error: Error, message: string) {
  spinner.fail(message)
  console.error(error)
  process.exit(1)
}
