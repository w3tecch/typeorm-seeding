import faker from '@faker-js/faker'
import { Factory } from '../../src/factory'
import { User } from '../entities/User.entity'

export class UserFactory extends Factory<User> {
  protected async definition(): Promise<User> {
    const user = new User()

    user.name = faker.name.findName()

    return user
  }
}
