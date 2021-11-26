import { Arguments, Argv, CommandModule } from 'yargs'
import ora from 'ora'
import chalk from 'chalk'
import { importSeed } from '../importer'
import { loadFilePaths, importFiles } from '../utils/file.util'
import { runSeeder } from '../typeorm-seeding'
import { configureConnection, getConnectionOptions, ConnectionOptions, fetchConnection } from '../connection'
import { ClassConstructor } from '../types'

interface SeedCommandArguments extends Arguments {
  root?: string
  configName?: string
  connection?: string
  seed?: string
}

export class SeedCommand implements CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  builder(args: Argv) {
    return args
      .option('n', {
        alias: 'configName',
        type: 'string',
        describe: 'Name of the typeorm config file (json or js).',
      })
      .option('c', {
        alias: 'connection',
        type: 'string',
        describe: 'Name of the typeorm connection',
      })
      .option('r', {
        alias: 'root',
        type: 'string',
        describe: 'Path to your typeorm config file',
      })
      .option('s', {
        alias: 'seed',
        type: 'string',
        describe: 'Specific seed class to run.',
      })
  }

  async handler(args: SeedCommandArguments) {
    const log = console.log
    const { default: pkg } = await import('../../package.json')
    log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`))
    const spinner = ora('Loading ormconfig').start()

    // Get TypeORM config file
    let option: ConnectionOptions
    try {
      configureConnection({
        root: args.root,
        configName: args.configName,
        connection: args.connection,
      })
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
      await fetchConnection()
      spinner.succeed('Database connected')
    } catch (error) {
      panic(spinner, error as Error, 'Database connection failed! Check your TypeORM config.')
    }

    // Run seeds
    for (const classConstructor of classConstructors) {
      spinner.start(`Executing ${classConstructor.name} Seeder`)
      try {
        await runSeeder(classConstructor)
        spinner.succeed(`Seeder ${classConstructor.name} executed`)
      } catch (error) {
        panic(spinner, error as Error, `Could not run the seed ${classConstructor.name}!`)
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
