import { Connection } from 'typeorm'
import { Seeder, Factory } from '../../src/types'
import { times } from '../../src/typeorm-seeding'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export default class CreatePets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const em = connection.createEntityManager()

    await times(10, async (n) => {
      // This creates a pet in the database
      const pet = await factory(Pet)().seed()
      // This only returns a entity with fake data
      const user = await factory(User)().make()
      user.pets = [pet]
      await em.save(user)
    })
  }
}
