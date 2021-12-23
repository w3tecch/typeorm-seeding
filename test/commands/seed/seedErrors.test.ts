import yargs from 'yargs'
import { SeedCommand } from '../../../src/commands/seed.command'

describe(SeedCommand, () => {
  let command: SeedCommand
  const exitFn = jest.fn()

  beforeEach(async () => {
    exitFn.mockClear()
    command = new SeedCommand()
  })

  describe(SeedCommand.prototype.handler, () => {
    test('Should throw error if config file is not valid', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed -n foo')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })

    test('Should throw error if seeder is not valid', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed -s FooSeeder')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })

    test('Should throw error if seeder fail to run', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })
  })
})
