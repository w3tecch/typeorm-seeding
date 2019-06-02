import * as yargs from 'yargs'
import chalk from 'chalk'
import { printError } from '../utils'
import {
  loadConnection,
  setConnection,
  loadEntityFactories,
  loadSeeds,
  runSeed,
} from '../typeorm-seeding'
import * as pkg from '../../package.json'

export class SeedCommand implements yargs.CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  builder(args: yargs.Argv) {
    return args
      .option('c', {
        alias: 'config',
        default: 'ormconfig.js',
        describe: 'Path to the typeorm config file (json or js).',
      })
      .option('s', {
        alias: 'seeds',
        default: 'database/seeds',
        describe: 'Directory where seeds are.',
      })
      .option('f', {
        alias: 'factories',
        default: 'database/factories',
        describe: 'Directory where enity factories are.',
      })
  }

  async handler(args: yargs.Arguments) {
    const log = console.log

    let factoryFiles
    let seedFiles
    try {
      factoryFiles = await loadEntityFactories(args.factories as string)
      seedFiles = await loadSeeds(args.seeds as string)
    } catch (error) {
      printError('Could not load factories and seeds!', error)
      process.exit(1)
    }

    // Status logging to print out the amount of factories and seeds.
    log(chalk.bold(`typeorm-seeding v${(pkg as any).version}`))
    log(
      '🔎 ',
      chalk.gray.underline(`found:`),
      chalk.blue.bold(
        `${factoryFiles.length} factories`,
        chalk.gray('&'),
        chalk.blue.bold(`${seedFiles.length} seeds`),
      ),
    )

    // Get database connection and pass it to the seeder
    try {
      const connection = await loadConnection(args.config as string)
      setConnection(connection)
    } catch (error) {
      printError(
        'Database connection failed! Check your typeORM config file.',
        error,
      )
      process.exit(1)
    }

    // Show seeds in the console
    for (const seedFile of seedFiles) {
      try {
        let className = seedFile.split('/')[seedFile.split('/').length - 1]
        className = className.replace('.ts', '').replace('.js', '')
        className = className.split('-')[className.split('-').length - 1]
        log(
          chalk.gray.underline(`executing seed:`),
          chalk.green.bold(`${className}`),
        )
        const seedFileObject: any = require(seedFile)
        await runSeed(seedFileObject.default)
      } catch (error) {
        printError(
          'Could not run the seeds! Check if your seed script exports the class as default. Verify that the path to the seeds and factories is correct.',
          error,
        )
        process.exit(1)
      }
    }

    log('👍 ', chalk.gray.underline(`finished seeding`))
    process.exit(0)
  }
}
