import { faker } from '@faker-js/faker'
import { Factory } from '../../src/factory'
import type { FactorizedAttrs } from '../../src/types'
import { User } from '../fixtures/User.entity'

export class UserFactory extends Factory<User> {
  protected entity = User

  protected attrs(): FactorizedAttrs<User> {
    return {
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number({ min: 18, max: 65 }),
      email: faker.internet.email(),
      pets: [],
    }
  }
}
