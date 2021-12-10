import { Connection } from 'typeorm'
import { EntityFactory } from './types'

export abstract class Seeder {
  abstract run(factory: EntityFactory, connection: Connection): Promise<void>
}
