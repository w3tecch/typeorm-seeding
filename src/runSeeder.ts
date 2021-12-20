import { fetchConnection } from './connection'
import type { Seeder } from './seeder'

export async function runSeeder(seeder: Seeder) {
  const connection = await fetchConnection()
  seeder.run(connection)
}
