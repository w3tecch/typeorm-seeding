import { times } from './helpers'

describe('times', () => {
  test('Should call the func 2 times ', async () => {
    const result = await times<string>(2, async () => 'a')

    expect(result.length).toBe(2)
    expect(result).toStrictEqual(['a', 'a'])
  })
})
