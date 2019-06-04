import { SeederConstructor } from './types'

export const importSeed = (filePath: string): SeederConstructor => {
  let className = filePath.split('/')[filePath.split('/').length - 1]
  className = className.replace('.ts', '').replace('.js', '')
  className = className.split('-')[className.split('-').length - 1]
  // TODO: without the default
  const seedFileObject: any = require(filePath)
  return seedFileObject.default
}
