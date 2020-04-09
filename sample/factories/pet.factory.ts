import Faker from 'faker'
import { define, factory } from '../../dist/typeorm-seeding'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

define(Pet, (faker: typeof Faker) => {
  const gender = faker.random.number(1)
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.random.number()
  // pet.user = factory(User)({ roles: ['admin'] })
  return pet
})
