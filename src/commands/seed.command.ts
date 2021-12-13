import { Arguments, Argv, CommandModule, exit } from 'yargs'
import ora, { Ora } from 'ora'
import { gray } from 'chalk'
import { configureConnection, fetchConnection } from '../connection'
import { useFactories } from '../useFactories'
import { Seeder } from '../seeder'
import { useSeeders } from '../useSeeders'
import { runSeeder } from '../runSeeder'

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
        default: 'default',
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
    const spinner = ora('Loading ormconfig').start()

    // Get TypeORM config file
    try {
      configureConnection({
        root: args.root,
        configName: args.configName,
        connection: args.connection,
      })
      spinner.succeed('ORM Config loaded')
    } catch (error) {
      panic(spinner, error as Error, 'Could not load the config file!')
    }

    // Find all factories and seed with help of the config
    spinner.start('Importing Factories')
    try {
      await useFactories()
      spinner.succeed('Factories are imported')
    } catch (error) {
      panic(spinner, error as Error, 'Could not import factories!')
    }

    // Show seeds in the console
    spinner.start('Importing Seeders')
    let seeders: Seeder[] = []
    try {
      seeders = await useSeeders()
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
    for (const seeder of seeders) {
      spinner.start(`Executing ${seeder.constructor.name} Seeder`)
      try {
        await runSeeder(seeder)
        spinner.succeed(`Seeder ${seeder.constructor.name} executed`)
      } catch (error) {
        panic(spinner, error as Error, `Could not run the seed ${seeder.constructor.name}!`)
      }
    }

    console.log('👍 ', gray.underline(`Finished Seeding`))
  }
}

function panic(spinner: Ora, error: Error, message: string) {
  spinner.fail(message)
  console.error(message)
  exit(1, error)
}
