import { loadFiles } from './file.util'
import * as path from 'path'
import * as glob from 'glob'

describe('loadFiles', () => {
  let syncMock: jest.Mock
  beforeEach(() => {
    syncMock = jest.fn()
    ;(glob as any).sync = syncMock
    syncMock.mockReturnValue(['fileA', 'fileB'])
  })

  test('Should return a flat array', () => {
    const results = loadFiles(['path/to/files', 'other/path/to/files'])

    expect(results.length).toBe(4)
    expect(results[0]).toBe('fileA')
    expect(results[1]).toBe('fileB')
  })

  test('Should call the sync method with the cwd path', () => {
    const results = loadFiles(['path/to/files'])

    expect(syncMock).toBeCalledWith(path.join(process.cwd(), 'path/to/files'))
  })
})
