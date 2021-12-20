import type { Connection } from 'typeorm'

export abstract class Seeder {
  abstract run(connection: Connection): Promise<void>
}
