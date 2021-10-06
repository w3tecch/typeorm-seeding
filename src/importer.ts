import { SeederConstructor, Seeder } from './types'

export const importSeed = async (filePath: string): Promise<SeederConstructor> => {
  const seedFileObject: { [key: string]: SeederConstructor } = await import(filePath)
  const keys = Object.keys(seedFileObject)
  return seedFileObject[keys[0]]
}
