import { Seeder } from '../../src/seeder'
import { EntityFactory } from '../../src'
import { User } from '../entities/User.entity'

export default class CreateUsers extends Seeder {
  public async run(factory: EntityFactory): Promise<void> {
    await factory(User).createMany(1, { firstName: 'Test' })
  }
}
