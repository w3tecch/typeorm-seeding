import Faker from 'faker'
import { define, factory } from '../../src'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

define(Pet, (faker: typeof Faker) => {
  const gender = faker.datatype.number(1)
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.datatype.number()
  pet.user = factory(User) as any
  return pet
})
