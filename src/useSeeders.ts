import { configureConnection, fetchConnection } from './connection'
import { Seeder } from './seeder'
import type { ClassConstructor, ConnectionConfiguration } from './types'

export async function useSeeders(entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[]): Promise<void>
export async function useSeeders(
  entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[],
  customOptions: Partial<ConnectionConfiguration>,
): Promise<void>

export async function useSeeders(
  entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[],
  customOptions?: Partial<ConnectionConfiguration>,
): Promise<void> {
  if (customOptions) configureConnection(customOptions)

  const connection = await fetchConnection()

  const seeders = Array.isArray(entrySeeders) ? entrySeeders : [entrySeeders]
  for (const seeder of seeders) {
    await new seeder().run(connection)
  }
}
