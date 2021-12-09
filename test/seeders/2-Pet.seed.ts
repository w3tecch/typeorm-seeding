import { Connection } from 'typeorm'
import { Factory } from '../../src'
import { Seeder } from '../../src/seeder'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export default class PetSeeder extends Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const users = await connection.createEntityManager().find(User)
    const petFactory = factory(Pet)()
    for (const user of users) {
      await petFactory.create({ owner: user })
    }
  }
}
