import * as yargs from 'yargs'
import * as ora from 'ora'
import * as chalk from 'chalk'
import { createConnection } from 'typeorm'
import { setConnection, runSeeder, getConnectionOptions, getConnection } from '../typeorm-seeding'
import { printError } from '../utils/log.util'
import { importSeed } from '../importer'
import { loadFiles, importFiles } from '../utils/file.util'
import { ConnectionOptions } from '../connection'

export class SeedCommand implements yargs.CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  builder(args: yargs.Argv) {
    return args
      .option('config', {
        default: 'ormconfig.js',
        describe: 'Path to the typeorm config file (json or js).',
      })
      .option('class', {
        alias: 'c',
        describe: 'Specific seed class to run.',
      })
  }

  async handler(args: yargs.Arguments) {
    // Disable logging for the seeders, but keep it alive for our cli
    // tslint:disable-next-line
    const log = console.log
    // // tslint:disable-next-line
    // console.log = () => void 0

    const pkg = require('../../package.json')
    log(chalk.bold(`typeorm-seeding v${(pkg as any).version}`))
    const spinner = ora('Loading ormconfig').start()

    // Get TypeORM config file
    let options: ConnectionOptions
    try {
      options = await getConnectionOptions(args.config as string)
      spinner.succeed('ORM Config loaded')
    } catch (error) {
      panic(spinner, error, 'Could not load the config file!')
    }

    // Find all factories and seed with help of the config
    spinner.start('Import Factories')
    const factoryFiles = loadFiles(options.factories || ['src/database/factories/**/*{.js,.ts}'])
    try {
      importFiles(factoryFiles)
      spinner.succeed('Factories are imported')
    } catch (error) {
      panic(spinner, error, 'Could not import factories!')
    }

    // Show seeds in the console
    spinner.start('Importing Seeders')
    const seedFiles = loadFiles(options.seeds || ['src/database/seeds/**/*{.js,.ts}'])
    let seedFileObjects: any[] = []
    try {
      seedFileObjects = seedFiles
        .map((seedFile) => importSeed(seedFile))
        .filter((seedFileObject) => args.class === undefined || args.class === seedFileObject.name)
      spinner.succeed('Seeders are imported')
    } catch (error) {
      panic(spinner, error, 'Could not import seeders!')
    }

    // Get database connection and pass it to the seeder
    spinner.start('Connecting to the database')
    try {
      const connection = await createConnection(options)
      setConnection(connection)
      spinner.succeed('Database connected')
    } catch (error) {
      panic(spinner, error, 'Database connection failed! Check your typeORM config file.')
    }

    // Run seeds
    for (const seedFileObject of seedFileObjects) {
      spinner.start(`Executing ${seedFileObject.name} Seeder`)
      try {
        await runSeeder(seedFileObject)
        spinner.succeed(`Seeder ${seedFileObject.name} executed`)
      } catch (error) {
        panic(spinner, error, `Could not run the seed ${seedFileObject.name}!`)
      }
    }

    log('👍 ', chalk.gray.underline(`Finished Seeding`))
    process.exit(0)
  }
}

function panic(spinner: ora.Ora, error: Error, message: string) {
  spinner.fail(message)
  // tslint:disable-next-line
  console.error(error)
  process.exit(1)
}
