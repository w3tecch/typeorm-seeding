import { faker } from '@faker-js/faker'
import { LazyInstanceAttribute } from '../../src'
import { Factory } from '../../src/factory'
import { InstanceAttribute } from '../../src/instanceAttribute'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { User } from '../fixtures/User.entity'
import { PetFactory } from './Pet.factory'

// Factory: Use every factorized attribute to test all paths
export class UserFactory extends Factory<User> {
  protected entity = User
  protected get attrs(): FactorizedAttrs<User> {
    return {
      name: faker.name.firstName(),
      lastName: async () => faker.name.lastName(),
      age: () => faker.datatype.number({ min: 18, max: 65 }),
      email: new InstanceAttribute((instance) =>
        [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
      ),
      pets: new LazyInstanceAttribute((instance) => new Subfactory(PetFactory, { owner: instance }, 5)),
    }
  }
}
