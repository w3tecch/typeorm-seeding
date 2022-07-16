import type { Faker, GenderType } from '@faker-js/faker'
import { define, factory } from '../../src/typeorm-seeding'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

define(Pet, (faker: Faker) => {
  const gender: GenderType = faker.datatype.boolean() ? 'female' : 'male';
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.datatype.number()
  pet.user = factory(User)({ roles: ['admin'] }) as any
  return pet
})
