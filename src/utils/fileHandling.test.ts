import { calculateFilePaths } from './fileHandling'

describe(calculateFilePaths, () => {
  test('Should return a flat array', () => {
    const results = calculateFilePaths(['*.js'])

    expect(results.length).toBeGreaterThan(0)
    expect(results.some((result) => result.includes('ormconfigZ.js'))).toBeTruthy()
  })
})
