import { configureConnection, fetchConnection } from './connection'
import { Seeder } from './seeder'
import type { ConnectionConfiguration, Constructable } from './types'

export async function useSeeders(entrySeeders: Constructable<Seeder> | Constructable<Seeder>[]): Promise<void>
export async function useSeeders(
  entrySeeders: Constructable<Seeder> | Constructable<Seeder>[],
  customOptions: Partial<ConnectionConfiguration>,
): Promise<void>

export async function useSeeders(
  entrySeeders: Constructable<Seeder> | Constructable<Seeder>[],
  customOptions?: Partial<ConnectionConfiguration>,
): Promise<void> {
  if (customOptions) configureConnection(customOptions)

  const connection = await fetchConnection()

  const seeders = Array.isArray(entrySeeders) ? entrySeeders : [entrySeeders]
  for (const seeder of seeders) {
    await new seeder().run(connection)
  }
}
