// import type { Connection } from 'typeorm'
// import yargs from 'yargs'
// import { configureConnection, fetchConnection } from '../../../src'
// import { SeedCommand } from '../../../src/commands/seed.command'

// describe(SeedCommand, () => {
//   let connection: Connection
//   let command: SeedCommand

//   beforeEach(async () => {
//     configureConnection({ connection: 'memory' })
//     connection = await fetchConnection()

//     await connection.synchronize()

//     command = new SeedCommand()
//   })

//   afterEach(async () => {
//     await connection.dropDatabase()
//     await connection.close()
//   })

//   describe(SeedCommand.prototype.handler, () => {
//     test('Should use default values', async () => {
//       await expect(yargs.command(command).parse('seed -c memory')).resolves.toBeTruthy()
//     })
//   })
// })
it.todo('test')
