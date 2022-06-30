import { resolve } from 'path'
import { sync } from 'glob'

export const calculateFilePath = (filePattern: string): string[] => {
  return sync(resolve(process.cwd(), filePattern), { ignore: '**/node_modules/**' })
}
