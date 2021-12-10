import { configureConnection } from '../../src/connection'
import { ConnectionConfigurationManager } from '../../src/connection/ConnectionConfigurationManager'

describe(configureConnection, () => {
  const configurationManager = ConnectionConfigurationManager.getInstance()

  test('Should return initial config if not updated', async () => {
    const initialConfig = configurationManager.configuration
    configureConnection()

    expect(configurationManager.configuration).toMatchObject(initialConfig)
  })

  test('Should update connection configuration', async () => {
    const newConfig = { connection: 'test', configName: 'test', root: 'test' }
    configureConnection(newConfig)

    expect(configurationManager.configuration).toMatchObject(newConfig)
  })
})
