import { Connection } from 'typeorm'
import { Factory } from './types'

export abstract class Seeder {
  abstract run(factory: Factory, connection: Connection): Promise<void>
}
