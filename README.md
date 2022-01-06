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
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/hirsch88">Gery Hirschfeld</a>, <a href="https://github.com/jorgebodega">Jorge Bodega</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

## ❯ Additional contents

- [Seeder](docs/seeder.md)
- [Factory](docs/factory.md)
- [CLI](docs/cli.md)
- [Testing features](docs/testing.md)

## ❯ Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that install the extension with `npm` or `yarn`. Add development flag if you are not using seeders nor factories in production code.

```bash
npm i [-D] @jorgebodega/typeorm-seeding
yarn add [-D] @jorgebodega/typeorm-seeding
```

### Configuration

To configure the path to your seeders change the TypeORM config file or use environment variables like TypeORM. If both are used the environment variables will be prioritized.

**ormconfig.js**

```typescript
module.exports = {
  ...
  seeders: ['src/seeds/**/*{.ts,.js}'],
  defaultSeeder: RootSeeder,
  ...
}
```

**.env**

```
TYPEORM_SEEDING_SEEDERS=src/seeds/**/*{.ts,.js}
TYPEORM_SEEDING_DEFAULT_SEEDER=RootSeeder
```

## Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a entity factory and/or seed script.

### Entity

```typescript
@Entity()
class User {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() name: string

  @Column() lastname: string
}
```

### Factory

```typescript
class UserFactory extends Factory<User> {
  protected definition(): User {
    const user = new User()

    user.name = 'John'
    user.lastname = 'Doe'

    return user
  }
}
```

### Seeder

```typescript
export class UserExampleSeeder extends Seeder {
  async run() {
    await new UserFactory().create({
      name: 'Jane',
    })
  }
}
```
