import { Seeder } from '../../src'
import { PetFactory } from './Pet.factory'

export class PetSeeder extends Seeder {
  async run() {
    await new PetFactory().create()
  }
}
