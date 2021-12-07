import { Connection } from 'typeorm'
import { Factory } from '../../src'
import { Seeder } from '../../src/seeder'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'

export default class PetSeeder extends Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const users = await factory(User)().createMany(2)
    const tobi = await factory(Pet)().create({
      owner: users[0],
    })

    const newPet = new Pet()
    newPet.name = `${tobi.name} brother`
    newPet.owner = users[1]
    connection.createEntityManager().save(new Pet())
  }
}
