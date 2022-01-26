import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { User } from '../entities/User.entity'

export class UserFactory extends Factory<User> {
  protected entity = User
  protected attrs = {
    name: faker.name.findName(),
    lastName: () => faker.name.lastName(),
  }
}
