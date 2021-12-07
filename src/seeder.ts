import { Connection } from 'typeorm'
import { ContextFactoryFunction } from './types'

export abstract class Seeder {
  abstract run(factory: ContextFactoryFunction, connection: Connection): Promise<void>
}
