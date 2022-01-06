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

## Additional contents

- [Factory](#factory-1)
- [Seeder](#seeder-1)
- [CLI](#cli-configuration)
- [Testing features](#testing-features)

## Installation

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

## Factory

Factory is how we provide a way to simplify entities creation, implementing a [factory creational pattern](https://refactoring.guru/design-patterns/factory-method). It is defined as an abstract class with generic typing, so you have to extend over it.

```typescript
class UserFactory extends Factory<User> {
  protected definition(): User {
    ...
  }
}
```

### `definition`

This function is the one that needs to be defined when extending the class. It is called to instantiate the entity and the result will be used on the rest of factory lifecycle.

```typescript
protected definition(): User {
    const user = new User()

    user.name = 'John'
    user.lastname = 'Doe'

    return user
}
```

It is possible to create more than one factory related to a single entity, with different definition functions.

### `map`

Use the `.map()` function to alter the generated value before they get processed.

```typescript
map(mapFunction: (entity: Entity) => void): Factory
```

```typescript
new UserFactory().map((user) => {
  user.name = 'Jane'
})
```

### `make` & `makeMany`

Make and makeMany executes the factory functions and return a new instance of the given entity. The instance is filled with the generated values from the factory function, but not saved in the database.

- **overrideParams** - Override some of the attributes of the entity.

```typescript
make(overrideParams: Partial<Entity> = {}): Promise<Entity>
makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity>
```

```typescript
new UserFactory().make()
new UserFactory().makeMany(10)

// override the email
new UserFactory().make({ email: 'other@mail.com' })
new UserFactory().makeMany(10, { email: 'other@mail.com' })
```

### `create` & `createMany`

the create and createMany method is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database using TypeORM entity manager.

- **overrideParams** - Override some of the attributes of the entity.
- **saveOptions** - [Save options](https://github.com/typeorm/typeorm/blob/master/src/repository/SaveOptions.ts) from TypeORM

```typescript
create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
createMany(amount: number, overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
```

```typescript
new UserFactory().create()
new UserFactory().createMany(10)

// override the email
new UserFactory().create({ email: 'other@mail.com' })
new UserFactory().createMany(10, { email: 'other@mail.com' })

// using save options
new UserFactory().create({ email: 'other@mail.com' }, { listeners: false })
new UserFactory().createMany(10, { email: 'other@mail.com' }, { listeners: false })
```

### Execution order

As the order of execution can be complex, you can check it here:

2. **Map function**: Map function alters the already existing entity.
3. **Override params**: Alters the already existing entity.
4. **Promises**: If some attribute is a promise, the promise will be resolved before the entity is created.
5. **Factories**: If some attribute is a factory, the factory will be executed with `make`/`create` like the previous one.

### Faker

[Faker](https://github.com/marak/Faker.js/) package was previously a dependency of the project, but now it is optional due to its size. If you want to use faker, you may need to install it and import it.

Instead of the previous example:

```typescript
define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  const user = new User()
  user.name = `${firstName} ${lastName}`
  return user
})
```

You can do:

```typescript
import * as faker from 'faker'

class UserFactory extends Factory<User> {
  protected definition(): User {
    const user = new User()

    user.name = faker.name.firstName()
    user.lastname = faker.name.lastName()

    return user
  }
}
```

## Seeder

Seeder class is how we provide a way to insert data into databases, and could be executed by the command line or by helper method. Is an abstract class with one method to be implemented, and a helper function to run some more seeder sequentially.

```typescript
class UserSeeder extends Seeder {
  async run(connection: Connection) {
    ...
  }
}
```

### `run`

This function is the one that needs to be defined when extending the class. Could use `call` to run some other seeders.

```typescript
run(connection: Connection): Promise<void>
```

```typescript
async run(connection: Connection) {
    await new UserFactory().createMany(10)

    await this.call(connection, [PetSeeder])
}
```

### `call`

This function allow to run some other seeders in a sequential way.

In order to use seeders from cli command, a default seeder class must be provided as root seeder, working as a tree structure.

<p align="center">
  <img src="./seeders.png" alt="logo" />
</p>

## CLI Configuration

There are two possible commands to execute, one to see the current configuration and one to run a seeder.

Add the following scripts to your `package.json` file to configure them.

```json
"scripts": {
  "seed:config": "typeorm-seeding config",
  "seed:run": "typeorm-seeding seed",
  ...
}
```

### `config`

This command just print the connection configuration.

```bash
typeorm-seeding config
```

Example result

```json
{
  "name": "default",
  "type": "sqlite",
  "database": "/home/jorgebodega/projects/typeorm-seeding/test.db",
  "entities": ["sample/entities/**/*{.ts,.js}"],
  "seeders": ["sample/seeders/**/*{.ts,.js}"],
  "defaultSeeder": "RootSeeder"
}
```

##### Options

| Option                 | Default               | Description                                                                  |
| ---------------------- | --------------------- | ---------------------------------------------------------------------------- |
| `--seed` or `-s`       | null                  | Option to specify a seeder class to run individually. (Only on seed command) |
| `--connection` or `-c` | TypeORM default value | Name of the TypeORM connection. Required if there are multiple connections.  |
| `--configName` or `-n` | TypeORM default value | Name to the TypeORM config file.                                             |
| `--root` or `-r`       | TypeORM default value | Path to the TypeORM config file.                                             |

### `seed`

This command execute a seeder, that could be specified as a parameter.

```bash
typeorm-seeding seed
```

##### Options

| Option                 | Default                              | Description                                                                 |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `--seed` or `-s`       | Default seeder specified config file | Option to specify a seeder class to run individually.                       |
| `--connection` or `-c` | TypeORM default value                | Name of the TypeORM connection. Required if there are multiple connections. |
| `--configName` or `-n` | TypeORM default value                | Name to the TypeORM config file.                                            |
| `--root` or `-r`       | TypeORM default value                | Path to the TypeORM config file.                                            |

## Testing features

We provide some testing features that we already use to test this package, like connection configuration.
The entity factories can also be used in testing. To do so call the `useFactories` or `useSeeders` function.

### `useSeeders`

Execute one or more seeders.

```typescript
useSeeders(entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[]): Promise<void>
useSeeders(
  entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[],
  customOptions: Partial<ConnectionConfiguration>,
): Promise<void>
```

### Factories

If factories are being used to create entities, just remember to clean up fake data after every execution.
