module.exports = [
  {
    name: 'default',
    type: 'sqlite',
    database: 'test.db',
    entities: ['sample/entities/**/*{.ts,.js}'],
    factories: ['sample/factories/**/*{.ts,.js}'],
    seeders: ['sample/seeds/**/*{.ts,.js}'],
    defaultSeeder: 'test',
  },
  {
    name: 'memory',
    type: 'sqlite',
    database: ':memory:',
    entities: ['sample/entities/**/*{.ts,.js}'],
    factories: ['sample/factories/**/*{.ts,.js}'],
    seeders: ['sample/seeds/**/*{.ts,.js}'],
    defaultSeeder: 'test',
  },
]
