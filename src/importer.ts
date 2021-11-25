import { ClassConstructor } from './types'

export const importSeed = async (filePath: string): Promise<ClassConstructor<any>[]> => {
  const importedElements: { [key: string]: any } = await import(filePath)
  return Object.values(importedElements).filter(
    (value) => Object.prototype.toString.call(value) === '[object Function]',
  )
}
