import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { LazyAttribute } from '../../src/lazyAttribute'
import { Subfactory } from '../../src/subfactory'
import { Pet } from '../entities/Pet.entity'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected attrs = {
    name: faker.name.findName(),
    lastName: async () => faker.name.findName(),
    owner: new LazyAttribute(
      (instance: Pet) =>
        new Subfactory(UserFactory, {
          name: `${instance.name} owner`,
        }),
    ),
  }
}
