import { factory } from '.'
import { fetchConnection } from './connection'
import { Seeder } from './seeder'
import { ClassConstructor } from './types'

export async function runSeeder(clazz: ClassConstructor<any>) {
  const seeder = new clazz()
  if (seeder instanceof Seeder) {
    const connection = await fetchConnection()
    seeder.run(factory, connection)
  }
}
