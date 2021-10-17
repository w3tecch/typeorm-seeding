import glob from 'glob'
import path from 'path'

export const importFiles = async (filePaths: string[]) => {
  await Promise.all(filePaths.map((filePath) => import(filePath)))
}

export const loadFiles = (filePattern: string[]): string[] => {
  return filePattern.flatMap((pattern) => glob.sync(path.resolve(process.cwd(), pattern)))
}
