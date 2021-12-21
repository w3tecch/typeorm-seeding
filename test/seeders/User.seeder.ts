import { Seeder } from '../../src'
import { UserFactory } from '../factories/User.factory'

export class UserSeeder extends Seeder {
  async run() {
    await new UserFactory().createMany(10)
  }
}
