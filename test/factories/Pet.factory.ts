import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { Pet } from '../entities/Pet.entity'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected attrs = {
    name: faker.name.findName(),
    lastName: async () => faker.name.findName(),
    // owner: new UserFactory() as any,
  }
}
