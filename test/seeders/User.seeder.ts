import type { Connection } from 'typeorm'
import { Seeder } from '../../src'
import { UserFactory } from '../factories/User.factory'
import { PetSeeder } from './Pet.seeder'

export class UserSeeder extends Seeder {
  async run(connection: Connection) {
    await new UserFactory().createMany(10)

    await this.call(connection, [PetSeeder])
  }
}
