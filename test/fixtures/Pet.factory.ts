import { faker } from '@faker-js/faker'
import { LazyInstanceAttribute } from '../../src'
import { Factory } from '../../src/factory'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { Pet } from './Pet.entity'
import { UserFactory } from './User.factory'

export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected get attrs(): FactorizedAttrs<Pet> {
    return {
      name: faker.animal.insect(),
      owner: new LazyInstanceAttribute(
        (instance) => new Subfactory(UserFactory, { name: faker.name.firstName(), pets: [instance] }),
      ),
    }
  }
}
