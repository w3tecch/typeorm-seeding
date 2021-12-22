import type { Connection } from 'typeorm'
import type { ClassConstructor } from './types'

export abstract class Seeder {
  abstract run(connection: Connection): Promise<void>

  protected async call(connection: Connection, seeders: ClassConstructor<Seeder>[]): Promise<void> {
    for (const seeder of seeders) {
      await new seeder().run(connection)
    }
  }
}
