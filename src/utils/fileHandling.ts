import { resolve } from 'path'
import { sync } from 'glob'

export const calculateFilePaths = (filePattern: string[]): string[] => {
  return filePattern.flatMap((pattern) => sync(resolve(process.cwd(), pattern)))
}
