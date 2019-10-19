#!/usr/bin/env nod
import 'reflect-metadata'

import * as yargs from 'yargs'

import { ConfigCommand } from './commands/config.command'
import { SeedCommand } from './commands/seed.command'

// tslint:disable-next-line
yargs
  .usage('Usage: $0 <command> [options]')
  .command(new ConfigCommand())
  .command(new SeedCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .help('h')
  .alias('h', 'help').argv
