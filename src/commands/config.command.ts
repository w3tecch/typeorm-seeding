import * as yargs from 'yargs'
import chalk from 'chalk'
import { printError } from '../utils/log.util'
import { configureConnection, getConnectionOptions, setConnectionOptions } from '../connection'
import { getConnectionOptions as TypeORMgetConnectionOptions } from 'typeorm'

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
    const { default: pkg } = await import('../../package.json')
    log('🌱  ' + chalk.bold(`TypeORM Seeding v${pkg.version}`))
    try {
      configureConnection({
        root: args.root as string,
        configName: args.configName as string,
        connection: args.connection as string,
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
