import { Seeder, Factory } from '../../dist/types'
import { User } from '../entities/User.entity'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)({ roles: [] }).seedMany(10)
  }
}
