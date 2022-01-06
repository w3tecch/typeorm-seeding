module.exports = [
  {
    name: 'default',
    type: 'sqlite',
    database: 'test.db',
    entities: ['sample/entities/**/*{.ts,.js}'],
    seeders: ['sample/seeders/**/*{.ts,.js}'],
    defaultSeeder: 'RootSeeder',
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['sample/entities/**/*{.ts,.js}'],
    seeders: ['sample/seeders/**/*{.ts,.js}'],
    defaultSeeder: 'RootSeeder',
  },
]
