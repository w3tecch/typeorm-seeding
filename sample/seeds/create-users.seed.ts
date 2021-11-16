import { Connection } from 'typeorm'
import { Seeder } from '../../src/seeder'
import { Factory } from '../../src/types'
import { User } from '../entities/User.entity'

export default class CreateUsers extends Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().createMany(1, { firstName: 'Test' })
  }
}
