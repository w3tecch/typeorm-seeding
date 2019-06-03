import { loadFiles, importFiles } from './utils/file.util'

// -------------------------------------------------------------------------
// Util functions
// -------------------------------------------------------------------------

const loadFactoryFiles = loadFiles('**/*actory{.js,.ts}')
const loadSeedFiles = loadFiles('**/*{.js,.ts}')

// -------------------------------------------------------------------------
// Facade functions
// -------------------------------------------------------------------------

export const loadEntityFactories = (pathToFolder: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    loadFactoryFiles(pathToFolder)(files => {
      importFiles(files)
      resolve(files)
    })(reject)
  })
}

export const loadSeeds = (pathToFolder: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    loadSeedFiles(pathToFolder + '/')(resolve)(reject)
  })
}

export const importSeed = (filePath: string): any => {
  let className = filePath.split('/')[filePath.split('/').length - 1]
  className = className.replace('.ts', '').replace('.js', '')
  className = className.split('-')[className.split('-').length - 1]

  const seedFileObject: any = require(filePath)
  return seedFileObject.default
}
