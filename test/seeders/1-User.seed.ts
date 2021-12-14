import { Seeder } from '../../src/seeder'
import { EntityFactory } from '../../src/types'
import { User } from '../entities/User.entity'

export default class UserSeeder extends Seeder {
  public async run(factory: EntityFactory): Promise<void> {
    await factory(User)().createMany(2)
  }
}
