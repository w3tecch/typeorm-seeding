import { Seeder } from '../../src'
import { PetFactory } from '../factories/Pet.factory'

export class PetSeeder extends Seeder {
  async run() {
    await new PetFactory().createMany(10)
  }
}
