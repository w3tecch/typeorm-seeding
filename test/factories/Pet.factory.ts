import * as faker from 'faker'
import { Factory } from '../../src/factory'
import { Pet } from '../entities/Pet.entity'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected async definition(): Promise<Pet> {
    const pet = new Pet()

    pet.name = faker.name.findName()
    pet.owner = new UserFactory() as any

    return pet
  }
}
