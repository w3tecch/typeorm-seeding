import { define, factory } from '../../src/factoriesMap'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

define(Pet, () => {
  const pet = new Pet()

  pet.name = 'Tobi'
  pet.owner = factory(User) as any

  return pet
})
