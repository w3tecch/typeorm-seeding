import yargs from 'yargs'
import { SeedCommand } from '../../src/commands/seed.command'
import { configureConnection } from '../../src/connection'

describe(SeedCommand, () => {
  let command: SeedCommand

  beforeAll(async () => {
    configureConnection({ connection: 'memory' })

    jest.spyOn(console, 'log').mockImplementation(() => void 0)
    jest.spyOn(console, 'error').mockImplementation(() => void 0)
  })

  describe.skip(SeedCommand.prototype.handler, () => {
    test('Should return default values', async () => {
      expect(yargs.command(command).parse('seed')).resolves
    })
  })
})
