import { define, factory } from '../../src/typeorm-seeding'
import { LabelingTicket } from '../entities/LabelingTicket.entity'
import { User } from '../entities/User.entity'

define(User, (faker) => {
  faker.locale = 'pt_BR'

  const quantity = faker.random.number({ min: 2, max: 10 })

  const isSuperuser = faker.random.boolean()
  const username = faker.random.word()
  // const password = faker.internet.password()

  const user = new User()
  user.username = username
  user.isSuperuser = isSuperuser
  // user.password = password
  // user.hashPassword()

  user.labelingTickets = Array(factory(LabelingTicket)().createMany(quantity) as any)
  return user
})
