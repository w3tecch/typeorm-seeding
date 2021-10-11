import { Factory, Seeder } from '../../src/typeorm-seeding'
import { User } from '../entities/User.entity'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(User)().create()
  }
}
