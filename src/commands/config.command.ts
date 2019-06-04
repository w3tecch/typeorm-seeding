import * as yargs from 'yargs'
import chalk from 'chalk'
import { getConnectionOptions } from '../typeorm-seeding'
import * as pkg from '../../package.json'
import { printError } from '../utils/log.util'

export class ConfigCommand implements yargs.CommandModule {
  command = 'config'
  describe = 'Show the TypeORM config'

  builder(args: yargs.Argv) {
    return args.option('c', {
      alias: 'config',
      default: 'ormconfig.js',
      describe: 'Path to the typeorm config file (json or js).',
    })
  }

  async handler(args: yargs.Arguments) {
    const log = console.log
    log(chalk.bold(`typeorm-seeding v${(pkg as any).version}`))
    try {
      const options = await getConnectionOptions(args.config as string)
      log(options)
    } catch (error) {
      printError('Could not find the orm config file', error)
      process.exit(1)
    }
    process.exit(0)
  }
}
