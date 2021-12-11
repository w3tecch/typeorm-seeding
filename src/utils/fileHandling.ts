import { sync } from 'glob'
import { resolve } from 'path'

export const calculateFilePaths = (filePattern: string[]): string[] => {
  return filePattern.flatMap((pattern) => sync(resolve(process.cwd(), pattern)))
}
