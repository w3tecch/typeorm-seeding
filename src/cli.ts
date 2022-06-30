#!/usr/bin/env node
/* istanbul ignore file */
import 'reflect-metadata'
import yargs from 'yargs'
import { SeedCommand } from './commands/seed.command'

yargs
  .usage('Usage: $0 <command> [options]')
  .command(new SeedCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .help('h')
  .alias('h', 'help').argv
