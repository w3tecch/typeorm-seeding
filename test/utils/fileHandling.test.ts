import { calculateFilePath } from '../../src/utils/fileHandling'

describe(calculateFilePath, () => {
  test('Should return a flat array', () => {
    const results = calculateFilePath('*.ts')

    expect(results.length).toBeGreaterThan(0)
    expect(results.some((result) => result.includes('jest.config.ts'))).toBeTruthy()
  })
})
