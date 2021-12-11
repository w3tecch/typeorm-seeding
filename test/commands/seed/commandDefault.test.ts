import yargs from 'yargs'
import { SeedCommand } from '../../../src/commands/seed.command'
import { fetchConnection } from '../../../src/connection'

jest.setTimeout(30000)

describe(SeedCommand, () => {
  let command: SeedCommand

  beforeAll(async () => {
    command = new SeedCommand()
    const connection = await fetchConnection()
    await connection.synchronize()
  })

  describe(SeedCommand.prototype.handler, () => {
    test('Should return default values', async () => {
      expect(yargs.command(command).parse('seed')).resolves
    })
  })
})
