import * as glob from 'glob'
import * as path from 'path'

export const importFiles = (filePaths: string[]) => filePaths.forEach(require)

export const loadFiles = (filePattern: string[]): string[] => {
  return filePattern
    .map((pattern) => glob.sync(path.resolve(process.cwd(), pattern)))
    .reduce((acc, filePath) => acc.concat(filePath), [])
}
