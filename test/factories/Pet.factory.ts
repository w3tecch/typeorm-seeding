import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { LazyAttribute } from '../../src/lazyAttribute'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { Pet } from '../entities/Pet.entity'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected attrs: FactorizedAttrs<Pet> = {
    name: faker.name.findName(),
    lastName: async () => faker.name.findName(),
    address: new LazyAttribute((instance) => async () => `${instance.name.toLowerCase()} address`),
    email: new LazyAttribute((instance) => `${instance.name.toLowerCase()}@example.com`),
    owner: new LazyAttribute(
      (instance) =>
        new Subfactory(UserFactory, {
          name: () => `${instance.name} owner`,
        }),
    ),
  }
}
