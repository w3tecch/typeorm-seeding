import { Connection } from 'typeorm'
import { Seeder } from '../../src/seeder'
import { Factory } from '../../src/types'
import { Pet } from '../entities/Pet.entity'

export default class CreatePets extends Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Pet)().create()
  }
}
