import { Arguments, Argv, CommandModule, exit } from 'yargs'
import ora, { Ora } from 'ora'
import { gray } from 'chalk'
import { configureConnection, getConnectionOptions } from '../connection'
import { Seeder } from '../seeder'
import { useSeeders } from '../useSeeders'
import { calculateFilePaths } from '../utils/fileHandling'
import type { ConnectionOptions, Constructable } from '../types'
import { SeederImportationError } from '../errors/SeederImportationError'

interface SeedCommandArguments extends Arguments {
  root?: string
  configName?: string
  connection?: string
  seed?: string
}

export class SeedCommand implements CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  /**
   * @inheritdoc
   */
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

  /**
   * @inheritdoc
   */
  async handler(args: SeedCommandArguments) {
    const spinner = ora({ text: 'Loading ormconfig', isSilent: process.env.NODE_ENV === 'test' }).start()

    // Get TypeORM config file
    let options!: ConnectionOptions
    try {
      configureConnection({
        root: args.root,
        configName: args.configName,
        connection: args.connection,
      })
      options = await getConnectionOptions()
      spinner.succeed('ORM Config loaded')
    } catch (error) {
      panic(spinner, error as Error, 'Could not load the config file!')
      return
    }

    // Show seeder in console
    spinner.start('Importing Seeder')
    let seeder!: Constructable<Seeder>
    try {
      const seederFiles = calculateFilePaths(options.seeders)
      const seedersImported = await Promise.all(seederFiles.map((seederFile) => import(seederFile)))
      const allSeeders = seedersImported.reduce((prev, curr) => Object.assign(prev, curr), {})

      const seederWanted = args.seed || options.defaultSeeder
      seeder = allSeeders[seederWanted]

      if (!seeder) {
        throw new SeederImportationError(`Seeder ${seederWanted} does not exist`)
      }
      spinner.succeed('Seeder imported')
    } catch (error) {
      panic(spinner, error as Error, 'Could not import seeders!')
      return
    }

    // Run seeder
    spinner.start(`Executing ${seeder.name} Seeder`)
    try {
      await useSeeders(seeder)
      spinner.succeed(`Seeder ${seeder.name} executed`)
    } catch (error) {
      panic(spinner, error as Error, `Could not run the seed ${seeder.name}!`)
      return
    }

    console.log('👍 ', gray.underline(`Finished Seeding`))
  }
}

function panic(spinner: Ora, error: Error, message: string) {
  spinner.fail(message)
  console.error(error.message)
  exit(1, error)
}
