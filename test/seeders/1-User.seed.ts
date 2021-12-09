import { Factory } from '../../src'
import { Seeder } from '../../src/seeder'
import { User } from '../entities/User.entity'

export default class UserSeeder extends Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(2)
  }
}
