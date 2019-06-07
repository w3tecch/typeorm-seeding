import { SeederConstructor, Seeder } from './types'

export const importSeed = (filePath: string): SeederConstructor => {
  const seedFileObject: { [key: string]: SeederConstructor } = require(filePath)
  const keys = Object.keys(seedFileObject)
  return seedFileObject[keys[0]]
}
