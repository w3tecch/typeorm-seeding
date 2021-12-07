import { factory } from '../../src/factoriesMap'
import { FactoryFunction } from '../../src/types'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export const petFactoryFn: FactoryFunction<Pet, any> = () => {
  const pet = new Pet()

  pet.name = 'Tobi'
  pet.owner = factory(User)() as any

  return pet
}
