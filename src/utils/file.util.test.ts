import { importFiles, loadFilePaths } from './file.util'

describe('importFiles', () => {
  test('Should successfully import files', () => {
    return expect(importFiles(['../../ormconfig.js'])).resolves.toBeUndefined()
  })

  test('Should raise an error if an import could not be done', () => {
    return expect(importFiles(['../ormconfig.js'])).rejects.toThrowError()
  })
})

describe('loadFiles', () => {
  test('Should return a flat array', () => {
    const results = loadFilePaths(['*.json'])

    expect(results.length).toBeGreaterThan(0)
    expect(results.some((result) => result.includes('package.json'))).toBeTruthy()
  })
})
