import { fetchConnection } from './connection'
import { factory } from './factoriesMap'
import { Seeder } from './seeder'

export async function runSeeder(seeder: Seeder) {
  const connection = await fetchConnection()
  seeder.run(factory, connection)
}
