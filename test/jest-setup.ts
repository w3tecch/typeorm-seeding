jest.mock('../ormconfig.ts', () => [
  {
    name: 'default',
    type: 'sqlite',
    database: 'test.db',
    entities: ['test/entities/**/*{.ts,.js}'],
    factories: ['test/factories/**/*{.ts,.js}'],
    seeds: ['test/seeds/**/*{.ts,.js}'],
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/entities/**/*{.ts,.js}'],
    factories: ['test/factories/**/*{.ts,.js}'],
    seeds: ['test/seeds/**/*{.ts,.js}'],
  },
])
