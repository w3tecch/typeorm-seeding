import glob from 'glob'
import * as path from 'path'

export const importFiles = (files: string[]) => files.forEach(require)

export const loadFiles = (filePattern: string) => (pathToFolder: string) => (
  successFn: (files: string[]) => void,
) => (failedFn: (error: any) => void) => {
  glob(
    path.join(process.cwd(), pathToFolder, filePattern),
    (error: any, files: string[]) =>
      error ? failedFn(error) : successFn(files),
  )
}
