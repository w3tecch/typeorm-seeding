import { faker } from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { InstanceAttribute } from '../../src/instanceAttribute'
import { Subfactory } from '../../src/subfactory'
import type { FactorizedAttrs } from '../../src/types'
import { User } from '../entities/User.entity'
import { PetFactory } from './Pet.factory'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected attrs: FactorizedAttrs<User> = {
    name: faker.name.findName(),
    lastName: async () => faker.name.findName(),
    address: new InstanceAttribute((instance) => async () => `${instance.name.toLowerCase()} address`),
    email: new InstanceAttribute((instance) => `${instance.name.toLowerCase()}@example.com`),
    pets: new Subfactory(PetFactory, 2),
  }
}
