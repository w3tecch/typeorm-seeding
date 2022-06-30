import type { DataSource } from 'typeorm'

export abstract class Seeder {
  abstract run(dataSource: DataSource): Promise<void>
}
