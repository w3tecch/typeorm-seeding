import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { LazyAttribute } from '../../src/lazyAttribute'
import { Subfactory } from '../../src/subfactory'
import { User } from '../entities/User.entity'
import { PetFactory } from './Pet.factory'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected attrs = {
    name: faker.name.findName(),
    lastName: new LazyAttribute((instance: User) => faker.name.lastName()),
    phone: new LazyAttribute((instance: User) => faker.random.number()),
  }
}
