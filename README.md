<p align="center">
  <img src="./w3tec-logo.png" alt="w3tec" width="400" />
</p>

<h1 align="center">TypeORM Seeding</h1>

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Sematic-Release" /></a>
  <a href="https://david-dm.org/w3tecch/typeorm-seeding">
    <img src="https://david-dm.org/w3tecch/typeorm-seeding/status.svg?style=flat" alt="Dependency" />
  </a>
  <a href="https://circleci.com/gh/w3tecch/typeorm-seeding">
    <img src="https://circleci.com/gh/w3tecch/typeorm-seeding.svg?style=svg&circle-token=76b764c6bf89b70a7a7a7fd668293f9aa44c4044" alt="Build Status" />
  </a>
</p>

<p align="center">
  <b>A delightful way to seed test data into your database.</b></br>
  <span>Inspired by the awesome framework <a href="https://laravel.com/">laravel</a> in PHP and of the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
  <sub>Made with ❤️ by <a href="https://github.com/w3tecch">w3tech</a>, <a href="https://twitter.com/GeryHirschfeld1">Gery Hirschfeld</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

![divider](./w3tec-divider.png)

## ❯ Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a factory for your entities (models) and a seed script.

![divider](./w3tec-divider.png)

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

```JavaScript
module.exports = {
  ...
  seeds: ['src/database/seeds/**/*.seed.ts'],
  factories: ['src/database/factories/**/*.factory.ts'],
}
```

![divider](./w3tec-divider.png)

## ❯ Writing Seeders

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
      .values([{ firstName: 'Timber', lastName: 'Saw' }, { firstName: 'Phantom', lastName: 'Lancer' }])
      .execute()
  }
}
```

## ❯ Running Seeders

Once you have written your seeder, you can add this script to your `package.json`.

```
  "scripts": {
    "seed": "ts-node ./node_modules/typeorm-seeding/dist/cli.js seed"
    ...
  }
```

And then  

```bash
npm run seed
```

### Using Model Factories

For all entities we want to seed, we need to define a factory. To do so we give you the awesome [faker](https://github.com/marak/Faker.js/) library as a parameter into your factory. Then create your "fake" entity and return it. Those factory files should be in the `src/database/factories` folder and suffixed with `.factory` like `src/database/factories/User.factory.ts`.

Settings can be used to pass some static value into the factory.

```typescript
import Faker from 'faker';
import { define } from "typeorm-seeding";
import { User } from '../entities'

define(User, (faker: typeof Faker, settings: { roles: string[] }) => {
  const gender = faker.random.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)
  const email = faker.internet.email(firstName, lastName)

  const user = new User()
  user.firstName = firstName
  user.lastName = lastName
  user.email = email
  user.roles = settings.roles
  return user
})
```

Handle relation in the entity factory like this.

```typescript
import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Pet } from '../entities'

define(Pet, (faker: typeof Faker, settings: undefined) => {
  const gender = faker.random.number(1)
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.random.number()
  pet.user = factory(User)({ roles: ['admin'] })
  return pet
})
```

In your seed script you can use the factory like this.
With the second function, accepting your settings defined in the factories, you are able to create different variations of entities.

```typescript
import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User } from '../entities'

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(User)({ roles: [] }).seedMany(10)
  }
}
```

Here an example with nested factories. You can use the `.map()` function to alter
the generated value before they get persisted.

```typescript
...
await factory(User)()
    .map(async (user: User) => {
        const pets: Pet[] = await factory(Pet)().seedMany(2);
        const petIds = pets.map((pet: Pet) => pet.Id);
        await user.pets().attach(petIds);
    })
    .seedMany(5);
...
```

To override specific properties in all the generated entities, you can send an additional object
containing the properties that you want to override as the first argument in the `.make()`
and `.seed()` methods, or as second argument in the `.makeMany()` and `.seedMany()` methods.

```typescript
...
await factory(User)()
    .seedMany(10, { roles: ['admin'], firstName: 'John' });
...
```

To deal with relations you can use the entity manager like this.

```typescript
export default class CreatePets implements Seeder {
  public async run(factory: FactoryInterface, connection: Connection): Promise<any> {
    const connection = await factory.getConnection()
    const em = connection.createEntityManager()

    await times(10, async n => {
      // This creates a pet in the database
      const pet = await factory(Pet)().seed()
      // This only returns a entity with fake data
      const user = await factory(User)({ roles: ['admin'] }).make()
      user.pets = [pet]
      await em.save(user)
    })
  }
}
```

Now you are able to execute your seeds with this command `npm run seed`.

### CLI Options

| Option             | Default        | Description                                                   |
| ------------------ | -------------- | ------------------------------------------------------------- |
| `--class` or `--c` | null           | Option to specify a specific seeder class to run individually |
| `--config`         | `ormconfig.js` | Path to the typeorm config file (json or js).                 |


## ❯ License

[MIT](/LICENSE)
