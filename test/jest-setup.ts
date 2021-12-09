jest.mock('../ormconfig.ts', () => [
  {
    name: 'default',
    type: 'sqlite',
    database: 'test.db',
    entities: ['test/entities/**/*.entity.ts}'],
    factories: ['test/factories/**/*.factory.ts'],
    seeds: ['test/seeders/**/*.seed.ts'],
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/entities/**/*.entity.ts}'],
    factories: ['test/factories/**/*.factory.ts'],
    seeds: ['test/seeders/**/*.seed.ts'],
  },
])
