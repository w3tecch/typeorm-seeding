jest.mock('../ormconfig.ts', () => [
  {
    name: 'default',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/entities/**/*.entity.ts'],
    seeders: ['test/seeders/**/*.seeder.ts'],
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/entities/**/*.entity.ts'],
    seeders: ['test/seeders/**/*.seeder.ts'],
  },
])
