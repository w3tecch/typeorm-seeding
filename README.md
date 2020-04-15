<p align="center">
  <img src="./logo.png" alt="logo" width="160" />
</p>

<h1 align="center" style="text-align: center;">TypeORM Seeding</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/typeorm-seeding">
    <img src="https://img.shields.io/npm/v/typeorm-seeding" alt="NPM package" />
  </a>
  <a href="https://travis-ci.org/w3tecch/typeorm-seeding">
    <img src="https://travis-ci.org/w3tecch/typeorm-seeding.svg?branch=master" alt="Build Status" />
  </a>
  <a href="https://david-dm.org/w3tecch/typeorm-seeding">
    <img src="https://david-dm.org/w3tecch/typeorm-seeding/status.svg?style=flat" alt="Dependency" />
  </a>
    <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Sematic-Release" /></a>
</p>

<p align="center">
  <b>A delightful way to seed test data into your database.</b></br>
  <span>Inspired by the awesome framework <a href="https://laravel.com/">laravel</a> in PHP and of the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
  <sub>Made with ❤️ by <a href="https://github.com/hirsch88">Gery Hirschfeld</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

## ❯ Table of contents

- [Introduction](#-introduction)
- [Installation](#-installation)
- [Basic Seeder](#-basic-seeder)
- [Using Entity Factory](#-using-entity-factory)
- [Seeding Data in Testing](#-seeding-data-in-testing)
- [Changelog](#-changelog)
- [License](#-license)

## ❯ Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a entity factory for your entities (models) and a seed script.

### Enity

First create your TypeORM entites.

```typescript
// user.enity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ nullable: true }) name: string
  @Column({ type: 'varchar', length: 100, nullable: false }) password: string
  @OneToMany((type) => Pet, (pet) => pet.user) pets: Pet[]

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(password || this.password, salt)
  }
}

// pet.enity.ts
@Entity()
export class Pet {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() name: string
  @Column() age: number
  @ManyToOne((type) => User, (user) => user.pets)
  @JoinColumn({ name: 'user_id' })
  user: User
}
```

### Factory

Then for each entity define a factory. The purpose of a factory is to create new entites with generate data.

> Note: Factories can also be used to generate data for testing.

```typescript
// user.factory.ts
define(User, (faker: typeof Faker) => {
  const gender = faker.random.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)

  const user = new User()
  user.name = `${firstName} ${lastName}`
  user.password = faker.random.word()
  return user
})

// pet.factory.ts
define(Pet, (faker: typeof Faker) => {
  const gender = faker.random.number(1)
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.random.number()
  pet.user = factory(User)() as any
  return pet
})
```

### Seeder

And last but not least, create a seeder. The seeder can be called by the configured cli command `seed:run`. In this case it generates 10 pets with a owner (User).

> Note: `seed:run` must be configured first. Go to [CLI Configuration](#cli-configuration).

```typescript
// create-pets.seed.ts
export default class CreatePets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Pet)().createMany(10)
  }
}
```

## ❯ Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that install the extension with `npm` or `yarn`.

```bash
npm i typeorm-seeding
# or
yarn add typeorm-seeding
```

Optional, install the type definitions of the `Faker` library.

```bash
npm install -D @types/faker
```

### Configuration

To configure the path to your seeds and factories change the TypeORM config file(ormconfig.js or ormconfig.json).

> The default paths are `src/database/{seeds,factories}/**/*{.ts,.js}`

**ormconfig.js**

```JavaScript
module.exports = {
  ...
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
}
```

**.env**

```
TYPEORM_SEEDING_FACTORIES=src/factories/**/*{.ts,.js}
TYPEORM_SEEDING_SEEDS=src/seeds/**/*{.ts,.js}
```

### CLI Configuration

Add the following scripts to your `package.json` file to configure the seed cli commands.

```
"scripts": {
  "seed:config": "ts-node ./node_modules/typeorm-seeding/dist/cli.js config"
  "seed:run": "ts-node ./node_modules/typeorm-seeding/dist/cli.js seed"
  ...
}
```

To execute the seed run `npm run seed:run` in the terminal.

> Note: More CLI optios are [here](#cli-options)

Add the following TypeORM cli commands to the package.json to drop and sync the database.

```
"scripts": {
  ...
  "schema:drop": "ts-node ./node_modules/typeorm/cli.js schema:drop",
  "schema:sync": "ts-node ./node_modules/typeorm/cli.js schema:sync",
  ...
}
```

#### CLI Options

| Option                 | Default         | Description                                                                 |
| ---------------------- | --------------- | --------------------------------------------------------------------------- |
| `--seed` or `-s`       | null            | Option to specify a seeder class to run individually.                       |
| `--connection` or `-c` | null            | Name of the typeorm connection. Required if there are multiple connections. |
| `--configName` or `-n` | `ormconfig.js`  | Name to the typeorm config file.                                            |
| `--root` or `-r`       | `process.cwd()` | Path to the typeorm config file.                                            |

## ❯ Basic Seeder

A seeder class only contains one method by default `run`. Within this method, you may insert data into your database. For manually insertion use the [Query Builder](https://typeorm.io/#/select-query-builder) or use the [Entity Factory](#-using-entity-factory)

> Note. The seeder files will be executed alphabetically.

```typescript
import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '../entities'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { firstName: 'Timber', lastName: 'Saw' },
        { firstName: 'Phantom', lastName: 'Lancer' },
      ])
      .execute()
  }
}
```

## ❯ Using Entity Factory

Of course, manually specifying the attributes for each entity seed is cumbersome. Instead, you can use entity factories to conveniently generate large amounts of database records.

For all entities we want to create, we need to define a factory. To do so we give you the awesome [faker](https://github.com/marak/Faker.js/) library as a parameter into your factory. Then create your "fake" entity and return it. Those factory files should be in the `src/database/factories` folder and suffixed with `.factory` like `src/database/factories/user.factory.ts`.

| Types           | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `Enity`         | TypeORM Enity like the user or the pet in the samples.                          |
| `Context`       | Argument to pass some static data into the factory function.                    |
| `EntityFactory` | This object is used to make new filled entities or create it into the database. |

### `define`

The define function creates a new enity factory.

```typescript
define: <Entity, Context>(entity: Entity, factoryFn: FactoryFunction<Entity, Context>) => void;
```

```typescript
import Faker from 'faker'
import { define } from 'typeorm-seeding'
import { User } from '../entities'

define(User, (faker: typeof Faker, context: { roles: string[] }) => { ... })
```

### `factory`

Factory retrieves the defined factory function and returns the EntityFactory to start creating new enities.

```typescript
factory: (entity: Entity) => (context?: Context) => EntityFactory<Entity, Context>
```

```typescript
factory(Pet)()
factory(Pet)({ name: 'Balou' })
```

### EntityFactory

#### `map`

Use the `.map()` function to alter the generated value before they get persisted.

```typescript
map(mapFunction: (entity: Entity) => Promise<Entity>): EntityFactory<Entity, Context>
```

```typescript
await factory(User)()
  .map(async (user: User) => {
    const pets: Pet[] = await factory(Pet)().createMany(2)
    const petIds = pets.map((pet: Pet) => pet.Id)
    await user.pets().attach(petIds)
  })
  .createMany(5)
```

#### `make` & `makeMany`

Make and makeMany executes the factory functions and return a new instance of the given enity. The instance is filled with the generated values from the factory function, but not saved in the database.

**overrideParams** - Override some of the attributes of the enity.

```typescript
make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity>
```

```typescript
await factory(User)().make()
await factory(User)().makeMany(10)

// override the email
await factory(User)().make({ email: 'other@mail.com' })
await factory(User)().makeMany(10, { email: 'other@mail.com' })
```

#### `create` & `createMany`

the create and createMany method is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database.

**overrideParams** - Override some of the attributes of the enity.

```typescript
create(overrideParams: EntityProperty<Entity> = {}): Promise<Entity>
```

```typescript
await factory(User)().create()
await factory(User)().createMany(10)

// override the email
await factory(User)().create({ email: 'other@mail.com' })
await factory(User)().createMany(10, { email: 'other@mail.com' })
```

## ❯ Seeding Data in Testing

The entity factories can also be used in testing. To do so call the `useSeeding` function, which loads all the defined entity factories.

Choose your test database wisley. We suggest to run your test in a sqlite in memory database.

```json
{
  "type": "sqlite",
  "name": "memory",
  "database": ":memory:"
}
```

However, if the test database is not in memory, than use the `--runInBand` flag to disable parallelizes runs.

```typescript
describe("UserService", () => {
  let connection: Connection

  beforeAll(async (done) => {
    connection = await useRefreshDatabase({ connection: 'memory' })
    await useSeeding()

    const user = await factory(User)().make()
    const createdUser = await factory(User)().create()

    await runSeeder(CreateUserSeed)
    done()
  })

  afterAll(async (done) => {
    await tearDownDatabase()
    done()
  })

  test('Should ...', () => { ... })
})
```

### `useSeeding`

Loads the defined entity factories.

```typescript
useSeeding(options: ConfigureOption = {}): Promise<void>
```

### `runSeeder`

Runs the given seeder class.

```typescript
runSeeder(seed: SeederConstructor): Promise<void>
```

### `useRefreshDatabase`

Connects to the database, drops it and recreates the schema.

```typescript
useRefreshDatabase(options: ConfigureOption = {}): Promise<Connection>
```

### `tearDownDatabase`

Closes the open database connection.

```typescript
tearDownDatabase(): Promise<void>
```

### `ConfigureOption`

```typescript
interface ConfigureOption {
  root?: string // path to the orm config file. Default = process.cwd()
  configName?: string // name of the config file. eg. ormconfig.js
  connection?: string // name of the database connection.
}
```

## ❯ Example Projects

> Please fill free to add your open-source project here. This helps others to better understand the seeding technology.

| Project                                                                                  | Description                                                                                                                    |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [copa-ch/copa-backend](https://github.com/copa-ch/copa-backend/tree/master/src/database) | 🚀 Nest application written in TypeScript for the COPA project. This app manages your tournaments and generates the schedules. |

## ❯ Changelog

[Changelog](https://github.com/w3tecch/typeorm-seeding/releases)

## ❯ License

[MIT](LICENSE)
