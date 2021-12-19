import * as Faker from 'faker'
import { Factory } from '../../src/factory'
import { User } from '../entities/User.entity'

export class UserFactory extends Factory<User> {
  protected definition(faker: typeof Faker): User {
    const user = new User()

    user.name = faker.name.findName()

    return user
  }
}
