import { Argv, Arguments, CommandModule, exit } from 'yargs'
import { bold, red } from 'chalk'
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
        default: 'default',
        describe: 'Name of the typeorm connection',
      })
      .option('r', {
        alias: 'root',
        type: 'string',
        describe: 'Path to your typeorm config file',
      })
  }

  async handler(args: ConfigCommandArguments) {
    const { default: pkg } = await import('../../package.json')
    console.log('🌱  ' + bold(`TypeORM Seeding v${pkg.version}`))
    try {
      configureConnection({
        root: args.root,
        configName: args.configName,
        connection: args.connection,
      })
      const options = await getConnectionOptions()
      console.log(options)
    } catch (error: any) {
      console.log('\n❌ ', red('Could not find the orm config file'))
      exit(1, error as Error)
    }
  }
}
