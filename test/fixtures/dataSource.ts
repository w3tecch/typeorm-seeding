import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ['test/fixtures/**/*.entity.ts'],
})
