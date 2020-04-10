import * as yargs from 'yargs'
import * as chalk from 'chalk'
import { getConnectionOption } from '../typeorm-seeding'
import { printError } from '../utils/log.util'

export class ConfigCommand implements yargs.CommandModule {
  command = 'config'
  describe = 'Show the TypeORM config'

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
  }

  async handler(args: yargs.Arguments) {
    const log = console.log
    const pkg = require('../../package.json')
    log(chalk.bold(`typeorm-seeding v${(pkg as any).version}`))
    try {
      const option = await getConnectionOption(
        {
          root: args.root as string,
          configName: args.configName as string,
        },
        args.connection as string,
      )
      log(option)
    } catch (error) {
      printError('Could not find the orm config file', error)
      process.exit(1)
    }
    process.exit(0)
  }
}
