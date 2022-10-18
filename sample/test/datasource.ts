import { join } from 'path'
import { DataSource } from 'typeorm'

const ds = new DataSource({
  name: 'file',
  type: 'sqlite',
  database: ':memory:',
  entities: ['sample/entities/**/*{.ts,.js}'],
})

export default ds
