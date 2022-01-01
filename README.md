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
- [Basic Seeder](#-basic-seeder)
- [Using Entity Factory](#-using-entity-factory)
- [Seeding Data in Testing](#-seeding-data-in-testing)

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

## ❯ Basic Seeder

A seeder class only use `run` method. Within this method, you may insert data into your database. For manually insertion use the [Query Builder](https://typeorm.io/#/select-query-builder) or use the [Entity Factory](#-using-entity-factory)

> Note. The seeder files will be executed alphabetically.

```typescript
export default class CreateUsers implements Seeder {
  public async run(factory: EntityFactory, connection: Connection): Promise<any> {
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
| `Entity`        | TypeORM Entity like the user or the pet in the samples.                         |
| `Context`       | Argument to pass some static data into the factory function.                    |
| `EntityFactory` | This object is used to make new filled entities or create it into the database. |

### `define`

The define function creates a new entity factory.

```typescript
define: <Entity, Context>(entity: Entity, factoryFn: FactoryFunction<Entity, Context>) => void;
```

```typescript
define(User, (faker: typeof Faker, context: { roles: string[] }) => {
  const user = new User()
  ...
  return user
})
```

### `factory`

Factory retrieves the defined factory function and returns the EntityFactory to start creating new enities.

```typescript
factory: (entity: Entity) => (context?: Context) => Factory<Entity, Context>
```

```typescript
factory(Pet)()
factory(Pet)({ name: 'Balou' })
```

### Factory

#### `map`

Use the `.map()` function to alter the generated value before they get processed.

```typescript
map(mapFunction: (entity: Entity) => Promise<Entity>): Factory<Entity, Context>
```

```typescript
await factory(User)()
  .map(async (user: User) => {
    const pets: Pet[] = await factory(Pet)().createMany(2)
    const petIds = pets.map((pet: Pet) => pet.Id)
    await user.pets().attach(petIds)
    return user
  })
  .createMany(5)
```

#### `make` & `makeMany`

Make and makeMany executes the factory functions and return a new instance of the given entity. The instance is filled with the generated values from the factory function, but not saved in the database.

- **overrideParams** - Override some of the attributes of the entity.

```typescript
make(overrideParams: Partial<Entity> = {}): Promise<Entity>
makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity>
```

```typescript
await factory(User)().make()
await factory(User)().makeMany(10)

// override the email
await factory(User)().make({ email: 'other@mail.com' })
await factory(User)().makeMany(10, { email: 'other@mail.com' })
```

#### `create` & `createMany`

the create and createMany method is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database using TypeORM entity manager.

- **overrideParams** - Override some of the attributes of the entity.
- **saveOptions** - [Save options](https://github.com/typeorm/typeorm/blob/master/src/repository/SaveOptions.ts) from TypeORM

```typescript
create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
createMany(amount: number, overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity>
```

```typescript
await factory(User)().create()
await factory(User)().createMany(10)

// override the email
await factory(User)().create({ email: 'other@mail.com' })
await factory(User)().createMany(10, { email: 'other@mail.com' })

// using save options
await factory(User)().create({ email: 'other@mail.com' }, { listeners: false })
await factory(User)().createMany(10, { email: 'other@mail.com' }, { listeners: false })
```

#### Execution order

As the order of execution can be complex, you can check it here:

1. **Context**: The context is used when the entity is being created
2. **Map function**: Map function alters the already existing entity.
3. **Override params**: Alters the already existing entity.
4. **Promises**: If some attribute is a promise, the promise will be resolved before the entity is created.
5. **Factories**: If some attribute is a factory, the factory will be executed with `make`/`create` like the previous one.

## ❯ Seeding Data in Testing

The entity factories can also be used in testing. To do so call the `useFactories` or `useSeeders` function.

### `useFactories`

Loads the defined entity factories.

```typescript
useFactories(options?: Partial<ConnectionConfiguration>): Promise<void>
useFactories(factories?: string[], options?: Partial<ConnectionConfiguration>): Promise<void>
```

### `useSeeders`

Loads the seeders, and could execute them.

```typescript
useSeeders(executeSeeders?: boolean, options?: Partial<ConnectionConfiguration>): Promise<Seeder[]>
useSeeders(executeSeeders?: boolean, seeders?: string[], options?: Partial<ConnectionConfiguration>): Promise<Seeder[]>
```

### `runSeeder`

Runs the given seeder class.

```typescript
runSeeder(seeder: Seeder): Promise<void>
```

### `ConnectionConfiguration`

```typescript
interface ConnectionConfiguration {
  root?: string // path to the orm config file. Default = process.cwd()
  configName?: string // name of the config file. eg. ormconfig.js
  connection = 'default' // name of the database connection.
}
```
