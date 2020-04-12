import { Connection } from 'typeorm'
import { Seeder, Factory } from '../../src/types'
import { times } from '../../src/typeorm-seeding'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export default class CreatePets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Pet)().seed()
  }
}
