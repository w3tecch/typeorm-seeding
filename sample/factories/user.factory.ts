import * as Faker from 'faker'
import { define } from '../../src/typeorm-seeding'
import { User } from '../entities/User.entity'

define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)
  const email = faker.internet.email(firstName, lastName)

  const user = new User()
  user.firstName = firstName
  user.lastName = lastName
  user.middleName = null
  user.email = email
  user.password = faker.random.word()
  return user
})
