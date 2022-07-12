import { existsSync, unlinkSync } from 'node:fs'
import { DataSource } from 'typeorm'
import { useDataSource } from '../../src'
import { fetchDataSource } from '../../src/datasource'
import { dataSource } from '../fixtures/dataSource'

describe(useDataSource, () => {
  describe('With initialized data source', () => {
    beforeAll(async () => {
      await dataSource.initialize()
    })

    afterAll(async () => {
      if (existsSync('test.sql')) {
        unlinkSync('test.sql')
      }

      await dataSource.destroy()
    })

    test('Should fetch data source', async () => {
      await useDataSource(dataSource)

      const dataSourceFetched = fetchDataSource()

      expect(dataSourceFetched).toBeInstanceOf(DataSource)
      expect(dataSourceFetched.isInitialized).toBeTruthy()
    })

    test('Should fetch data source overriding options', async () => {
      await useDataSource(dataSource, { database: 'test.sql' })

      const dataSourceFetched = fetchDataSource()

      expect(dataSourceFetched).toBeInstanceOf(DataSource)
      expect(dataSourceFetched.isInitialized).toBeTruthy()
      expect(dataSourceFetched.options).toMatchObject({
        database: 'test.sql',
      })
    })

    describe('With initialization flag', () => {
      test('Should raise error with initialization flag', async () => {
        await expect(useDataSource(dataSource, true)).rejects.toThrow(Error)
      })

      test('Should raise error with initialization flag and options override', async () => {
        await expect(useDataSource(dataSource, { database: 'test.sql' }, true)).rejects.toThrow(Error)
      })
    })
  })

  describe('With non initialized data source', () => {
    afterAll(async () => {
      if (existsSync('test.sql')) {
        unlinkSync('test.sql')
      }
    })

    test('Should fetch data source', async () => {
      await useDataSource(dataSource)

      const dataSourceFetched = fetchDataSource()

      expect(dataSourceFetched).toBeInstanceOf(DataSource)
      expect(dataSourceFetched.isInitialized).toBeFalsy()
    })

    test('Should fetch data source overriding options', async () => {
      await useDataSource(dataSource, { database: 'test.sql' })

      const dataSourceFetched = fetchDataSource()

      expect(dataSourceFetched).toBeInstanceOf(DataSource)
      expect(dataSourceFetched.isInitialized).toBeFalsy()
      expect(dataSourceFetched.options).toMatchObject({
        database: 'test.sql',
      })
    })

    describe('With initialization flag', () => {
      afterEach(async () => {
        await dataSource.destroy()
      })

      test('Should fetch data source initializing it', async () => {
        await useDataSource(dataSource, true)

        const dataSourceFetched = fetchDataSource()

        expect(dataSourceFetched).toBeInstanceOf(DataSource)
        expect(dataSourceFetched.isInitialized).toBeTruthy()
      })

      test('Should fetch data source overriding options and initializing it', async () => {
        await useDataSource(dataSource, { database: 'test.sql' }, true)

        const dataSourceFetched = fetchDataSource()

        expect(dataSourceFetched).toBeInstanceOf(DataSource)
        expect(dataSourceFetched.isInitialized).toBeTruthy()
        expect(dataSourceFetched.options).toMatchObject({
          database: 'test.sql',
        })
      })
    })
  })
})
