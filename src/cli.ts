#!/usr/bin/env nod
import 'reflect-metadata'
import * as yargs from 'yargs'
import { SeedCommand } from './commands/seed.command'

yargs
  .usage('Usage: $0 <command> [options]')
  .command(new SeedCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .help('h')
  .alias('h', 'help').argv
