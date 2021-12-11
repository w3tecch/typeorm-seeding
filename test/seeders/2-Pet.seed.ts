import { Connection } from 'typeorm'
import { Seeder } from '../../src/seeder'
import { EntityFactory } from '../../src/types'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export default class PetSeeder extends Seeder {
  public async run(factory: EntityFactory, connection: Connection): Promise<void> {
    const users = await connection.createEntityManager().find(User)
    const petFactory = factory(Pet)()
    for (const user of users) {
      await petFactory.create({ owner: user })
    }
  }
}
