import { define } from '../../src/typeorm-seeding'
import { LabelingTicket } from '../entities/LabelingTicket.entity'

define(LabelingTicket, (faker) => {
  faker.locale = 'pt_BR'

  const name = faker.random.word()

  const user = new LabelingTicket()
  user.name = name
  return user
})
