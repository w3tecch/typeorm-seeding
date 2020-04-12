<p align="center">
  <img src="./logo.svg" alt="logo" width="160" />
</p>

<h1 align="center">TypeORM Seeding</h1>

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

<hr>

## ❯ Table of content

- [Introduction](/#-introduction)
- [Installation](/#-installation)
- [Basic Seeder](/#-basic-seeder)
- [Factory API](/#-factory-api)
- [Changelog](/#-changelog)
- [License](/#-license)

<hr>

## ❯ Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a factory for your entities (models) and a seed script.

### Enity

First create your TypeORM entites.

```TypeScript
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

The purpose of a factory is to create new fake entites with generate data.

> Factories can also be used to generate test data for some unit, integration or e2e tests.

```TypeScript
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

The seeder can be called by the configured cli command `seed:run`. In this case it generates 10 pets with a owner (User).

```TypeScript
// create-pets.seed.ts
export default class CreatePets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Pet)().seedMany(10)
  }
}
```

<hr>

## ❯ Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

You can install our extension with `npm` or `yarn`.

```bash
npm i typeorm-seeding
```

or with yarn

```bash
yarn add typeorm-seeding
```

Optional, for `Faker` types

```bash
npm install -D @types/faker
```

### Configuration

To configure the path to your seeds and factories change the TypeORM config file(ormconfig.js or ormconfig.json).

> Default is `src/database/{seeds,factories}/**/*{.ts,.js}`

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

Add the following scripts to your `package.json` file.

```
"scripts": {
  "seed:config": "ts-node ./node_modules/typeorm-seeding/dist/cli.js config"
  "seed:run": "ts-node ./node_modules/typeorm-seeding/dist/cli.js seed"
  ...
}
```

> Now you are able to execute your seeds with this command `npm run seed:run`.

Add the following TypeORM cli commands to the package.json to drop and sync the database.

```
"scripts": {
  ...
  "schema:drop": "ts-node ./node_modules/typeorm/cli.js schema:drop",
  "schema:sync": "ts-node ./node_modules/typeorm/cli.js schema:sync",
  ...
}

#### CLI Options

| Option                 | Default         | Description                                                                 |
| ---------------------- | --------------- | --------------------------------------------------------------------------- |
| `--seed` or `-s`       | null            | Option to specify a specific seeder class to run individually.              |
| `--connection` or `-c` | null            | Name of the typeorm connection. Required if there are multiple connections. |
| `--configName` or `-n` | `ormconfig.js`  | Name to the typeorm config file.                                            |
| `--root` or `-r`       | `process.cwd()` | Path to the typeorm config file.                                            |

<hr>

## ❯ Basic Seeder

The seeds files define how much and how the data are connected with each other. The files will be executed alphabetically.

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

## ❯ Factory API

For all entities we want to seed, we need to define a factory. To do so we give you the awesome [faker](https://github.com/marak/Faker.js/) library as a parameter into your factory. Then create your "fake" entity and return it. Those factory files should be in the `src/database/factories` folder and suffixed with `.factory` like `src/database/factories/user.factory.ts`.

**Enity** - TypeORM Enity like the user or the pet in the samples.

**Context** - Argument to pass some static data into the factory function.

**EntityFactory** - This object is used to make new filled entities or seed it into the database.

### define

The define function creates a new enity factory.

```typescript
define: <Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) => void;
```

**Example**

```typescript
import Faker from 'faker'
import { define } from 'typeorm-seeding'
import { User } from '../entities'

define(User, (faker: typeof Faker, context: { roles: string[] }) => { ... })
```

### factory

Factory retrieves the defined factory function and returns the EntityFactory to start creating new enities.

```typescript
factory: (entity: Entity) => (context?: Context) => EntityFactory<Entity, Context>
```

**Example**

```typescript
factory(Pet)().seed()
```

### Entity Factory

#### map

Use the `.map()` function to alter the generated value before they get persisted.

```typescript
map(mapFunction: (entity: Entity) => Promise<Entity>): EntityFactory<Entity, Context>
```

**Example**

```typescript
await factory(User)()
  .map(async (user: User) => {
    const pets: Pet[] = await factory(Pet)().seedMany(2)
    const petIds = pets.map((pet: Pet) => pet.Id)
    await user.pets().attach(petIds)
  })
  .seedMany(5)
```

#### make & makeMany

Make and makeMany executes the factory functions and return a new instance of the given enity. The instance is filled with the generated values from the factory function.

**overrideParams** - Override some of the attributes of the enity.

```typescript
make(overrideParams: EntityProperty<Entity> = {}): Promise<Entity>
```

**Example**

```typescript
await factory(User)().make()
await factory(User)().makeMany(10)

// override the email
await factory(User)().make({ email: 'other@mail.com' })
```

#### seed & seedMany

seed and seedMany is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database.

**overrideParams** - Override some of the attributes of the enity.

```typescript
seed(overrideParams: EntityProperty<Entity> = {}): Promise<Entity>
```

**Example**

```typescript
await factory(User)().seed()
await factory(User)().seedMany(10)

// override the email
await factory(User)().seed({ email: 'other@mail.com' })
```

<hr>

## ❯ Changelog

[Changelog](https://github.com/w3tecch/typeorm-seeding/releases)

## ❯ License

[MIT](LICENSE)
