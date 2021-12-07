import { ClassConstructor } from './types'

export const importSeed = async (filePath: string): Promise<ClassConstructor<any> | undefined> => {
  const { default: seeder }: { default: ClassConstructor<any> } = await import(filePath)

  if (Object.prototype.toString.call(seeder) === '[object Function]') return seeder
  return undefined
}
