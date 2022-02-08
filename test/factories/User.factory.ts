import { faker } from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { InstanceAttribute } from '../../src/instanceAttribute'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { User } from '../entities/User.entity'
import { CountryFactory } from './Country.factory'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected attrs: FactorizedAttrs<User> = {
    name: faker.name.firstName(),
    lastName: async () => faker.name.lastName(),
    email: new InstanceAttribute((instance) =>
      [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
    ),
    country: new Subfactory(CountryFactory),
  }
}
