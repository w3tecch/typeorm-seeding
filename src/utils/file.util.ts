import glob from 'glob'
import * as path from 'path'

export const importFiles = (filePaths: string[]) => filePaths.forEach(require)

export const loadFiles = (filePattern: string[]): string[] => {
  const filePaths: string[] = filePattern
    .map(pattern => glob.sync(path.join(process.cwd(), pattern)))
    .reduce((acc, filePath) => acc.concat(filePath), [])
  return filePaths
}
