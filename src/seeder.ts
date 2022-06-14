import type { DataSource } from 'typeorm'
import type { Constructable } from './types'

export abstract class Seeder {
  abstract run(dataSource: DataSource): Promise<void>

  protected async call(dataSource: DataSource, seeders: Constructable<Seeder>[]): Promise<void> {
    for (const seeder of seeders) {
      await new seeder().run(dataSource)
    }
  }
}
