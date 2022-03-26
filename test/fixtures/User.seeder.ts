import { Connection } from 'typeorm'
import { Seeder } from '../../src'
import { PetSeeder } from './Pet.seeder'
import { UserFactory } from './User.factory'

export class UserSeeder extends Seeder {
  async run(connection: Connection) {
    await new UserFactory().createMany(10)

    await this.call(connection, [PetSeeder])
  }
}
