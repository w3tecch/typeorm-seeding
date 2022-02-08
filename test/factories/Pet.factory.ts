import { faker } from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { InstanceAttribute } from '../../src/instanceAttribute'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { Pet } from '../entities/Pet.entity'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected attrs: FactorizedAttrs<Pet> = {
    name: faker.animal.type(),
    owner: new InstanceAttribute(
      (instance) =>
        new Subfactory(UserFactory, {
          name: instance.name,
          lastName: `owner`,
        }),
    ),
  }
}
