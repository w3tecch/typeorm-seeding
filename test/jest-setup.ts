jest.mock('../ormconfig.ts', () => [
  {
    name: 'default',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/fixtures/**/*.entity.ts'],
    seeders: ['test/fixtures/**/*.seeder.ts'],
    defaultSeeder: 'UserSeeder',
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['test/fixtures/**/*.entity.ts'],
    seeders: ['test/fixtures/**/*.seeder.ts'],
    defaultSeeder: 'UserSeeder',
  },
])
