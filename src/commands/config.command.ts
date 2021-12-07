import { Argv, Arguments, CommandModule } from 'yargs'
import chalk from 'chalk'
import { printError } from '../utils/log.util'
import { configureConnection, getConnectionOptions } from '../connection'

interface ConfigCommandArguments extends Arguments {
  root?: string
  configName?: string
  connection?: string
}

export class ConfigCommand implements CommandModule {
  command = 'config'
  describe = 'Show the TypeORM config'

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
  }

  async handler(args: ConfigCommandArguments) {
    const log = console.log
    const { default: pkg } = await import('../../package.json')
    log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`))
    try {
      await configureConnection({
        root: args.root,
        configName: args.configName,
        connection: args.connection,
      })
      const options = await getConnectionOptions()
      log(options)
    } catch (error) {
      printError('Could not find the orm config file', error)
      process.exit(1)
    }
    process.exit(0)
  }
}
