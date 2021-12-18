import { EntityFactory } from '../../src'
import { Seeder } from '../../src/seeder'
import { Pet } from '../entities/Pet.entity'

export default class CreatePets extends Seeder {
  public async run(factory: EntityFactory): Promise<void> {
    await factory(Pet).create()
  }
}
