import type { DataSource } from 'typeorm'
import { Seeder } from '../../src'
import { PetSeeder } from './Pet.seeder'
import { UserFactory } from './User.factory'

export class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    await new UserFactory().create()

    await this.call(dataSource, [PetSeeder])
  }
}
