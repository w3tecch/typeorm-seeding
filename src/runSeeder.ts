import { fetchConnection } from './connection'
import { Seeder } from './seeder'

export async function runSeeder(seeder: Seeder) {
  const connection = await fetchConnection()
  seeder.run(connection)
}
