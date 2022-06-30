import { Seeder } from '../../src'
import { UserFactory } from './User.factory'

export class UserSeeder extends Seeder {
  async run() {
    await new UserFactory().create()
  }
}
