<p align="center">
  <img src="./logo.png" alt="logo" width="160" />
</p>
<h1 align="center" style="text-align: center;">TypeORM Seeding</h1>

<p align="center">
  <img alt="NPM" src="https://img.shields.io/npm/l/@jorgebodega/typeorm-seeding?style=for-the-badge">
  <a href="https://www.npmjs.com/package/@jorgebodega/typeorm-seeding">
    <img alt="NPM latest version" src="https://img.shields.io/npm/v/@jorgebodega/typeorm-seeding/latest?style=for-the-badge">
  </a>
  <a href="https://www.npmjs.com/package/@jorgebodega/typeorm-seeding/v/next">
    <img alt="NPM next version" src="https://img.shields.io/npm/v/@jorgebodega/typeorm-seeding/next?style=for-the-badge">
  </a>
  <a href="https://github.com/semantic-release/semantic-release">
    <img src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release&style=for-the-badge" alt="Semantic release" />
  </a> 
</p>

<p align="center">
  <a href='https://coveralls.io/github/jorgebodega/typeorm-seeding'>
    <img alt="Coveralls master branch" src="https://img.shields.io/coveralls/github/jorgebodega/typeorm-seeding/master?style=for-the-badge">
  </a>
  <a href='https://coveralls.io/github/jorgebodega/typeorm-seeding?branch=next'>
    <img alt="Coveralls next branch" src="https://img.shields.io/coveralls/github/jorgebodega/typeorm-seeding/next?style=for-the-badge&label=coverage%40next">
  </a>
</p>

<p align="center">
  <img alt="Checks for master branch" src="https://img.shields.io/github/checks-status/jorgebodega/typeorm-seeding/master?style=for-the-badge">
  <a href='https://coveralls.io/github/jorgebodega/typeorm-seeding'>
    <img alt="Checks for next branch" src="https://img.shields.io/github/checks-status/jorgebodega/typeorm-seeding/next?label=checks%40next&style=for-the-badge">
  </a>
</p>

<p align="center">
  <b>A delightful way to seed test data into your database.</b></br>
  <span>Inspired by the awesome framework <a href="https://laravel.com/">laravel</a> in PHP and of the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
  <sub>Made with ❤️ by <a href="https://github.com/hirsch88">Gery Hirschfeld</a>, <a href="https://github.com/jorgebodega">Jorge Bodega</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

## ❯ Table of contents

- [Installation](#-installation)
- [Introduction](#-introduction)
- [Seeder](docs/seeder.md)
- [Factory](docs/factory.md)
- [Testing features](docs/testing.md)

## ❯ Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that install the extension with `npm` or `yarn`. Add development flag if you are not using seeders nor factories in production code.

```bash
npm i [-D] @jorgebodega/typeorm-seeding
yarn add [-D] @jorgebodega/typeorm-seeding
```

Optional, install the type definitions of the `Faker` library.

```bash
npm install -D @types/faker
```

### Configuration

To configure the path to your seeds and factories change the TypeORM config file or use environment variables like TypeORM. If both are used the environment variables will be prioritized.

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
  "seed:config": "typeorm-seeding config",
  "seed:run": "typeorm-seeding seed",
  ...
}
```

#### CLI Options

| Option                 | Default               | Description                                                                  |
| ---------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `--seed` or `-s`       | null                  | Option to specify a seeder class to run individually. (Only on seed command) |
| `--connection` or `-c` | TypeORM default value | Name of the TypeORM connection. Required if there are multiple connections.  |
| `--configName` or `-n` | TypeORM default value | Name to the TypeORM config file.                                             |
| `--root` or `-r`       | TypeORM default value | Path to the TypeORM config file.                                             |

## ❯ Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a entity factory for your entities (models) and a seed script.

### Entity

First create your TypeORM entities.

```typescript
// user.entity.ts
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

// pet.entity.ts
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
  const gender = faker.datatype.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)

  const user = new User()
  user.name = `${firstName} ${lastName}`
  user.password = faker.random.word()
  return user
})

// pet.factory.ts
define(Pet, (faker: typeof Faker) => {
  const gender = faker.datatype.number(1)
  const name = faker.name.firstName(gender)

  const pet = new Pet()
  pet.name = name
  pet.age = faker.datatype.number()
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

Until [this issue](https://github.com/w3tecch/typeorm-seeding/issues/119) is closed, seeder files must not contain any other export statement besides the one that exports the seeder class.
