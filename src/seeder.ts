import type { Connection } from 'typeorm'
import type { Constructable } from './types'

export abstract class Seeder {
  abstract run(connection: Connection): Promise<void>

  protected async call(connection: Connection, seeders: Constructable<Seeder>[]): Promise<void> {
    for (const seeder of seeders) {
      await new seeder().run(connection)
    }
  }
}
