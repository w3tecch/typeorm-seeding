const path = require('path')

module.exports = [
    {
        name: 'sample',
        type: 'sqlite',
        database: 'test.db',
        entities: ['sample/entities/**/*{.ts,.js}'],
        factories: ['sample/factories/**/*{.ts,.js}'],
        seeds: ['sample/seeds/**/*{.ts,.js}'],
    },
    {
        name: 'other',
        type: 'sqlite',
        database: 'test.db',
        entities: ['sample/entities/**/*{.ts,.js}'],
        factories: ['sample/factories/**/*{.ts,.js}'],
        seeds: ['sample/seeds/**/*{.ts,.js}'],
    }
]
