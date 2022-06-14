import { fetchDataSource } from '../datasource'
import { Seeder } from '../seeder'
import type { Constructable } from '../types'

export async function useSeeders(entrySeeders: Constructable<Seeder> | Constructable<Seeder>[]): Promise<void> {
  const dataSource = fetchDataSource()

  const seeders = Array.isArray(entrySeeders) ? entrySeeders : [entrySeeders]
  for (const seeder of seeders) {
    await new seeder().run(dataSource)
  }
}
