import * as yargs from 'yargs'
import * as chalk from 'chalk'
import { printError } from '../utils/log.util'
import { configureConnection, loadDataSource } from '../connection'

export class ConfigCommand implements yargs.CommandModule {
  command = 'config'
  describe = 'Show the TypeORM config'

  builder(args: yargs.Argv) {
    return args.option('d', {
      alias: 'dataSource',
      demandOption: true,
      describe: 'Path to the file where your DataSource instance is defined.',
    })
  }

  async handler(args: yargs.Arguments) {
    const log = console.log
    const pkg = require('../../package.json')
    log('🌱  ' + chalk.bold(`TypeORM Seeding v${(pkg as any).version}`))
    try {
      configureConnection({
        dataSourcePath: args.dataSource as string,
      })
      const ds = await loadDataSource()
      log(ds.options)
    } catch (error) {
      printError('Could not find the orm config file', error)
      process.exit(1)
    }
    process.exit(0)
  }
}
