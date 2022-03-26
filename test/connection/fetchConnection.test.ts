import { Connection } from 'typeorm'
import { fetchConnection } from '../../src'

describe(fetchConnection, () => {
  let connection: Connection

  beforeEach(async () => {
    if (connection) {
      await connection.close()
    }
  })

  test('Should create a connection', async () => {
    connection = await fetchConnection()

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.isConnected).toBeTruthy()
  })

  test('Should get an existing connection but disconnected', async () => {
    connection = await fetchConnection()

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.isConnected).toBeTruthy()
  })

  test('Should get an existing connection', async () => {
    await fetchConnection()
    connection = await fetchConnection()

    expect(connection).toBeInstanceOf(Connection)
    expect(connection.isConnected).toBeTruthy()
  })
})
