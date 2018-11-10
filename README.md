<p align="center">
  <img src="./w3tec-logo.png" alt="w3tec" width="400" />
</p>

<h1 align="center">TypeORM Seeding</h1>

<p align="center">
  <a href="https://david-dm.org/w3tecch/typeorm-seeding">
    <img src="https://david-dm.org/w3tecch/typeorm-seeding/status.svg?style=flat" alt="dependency" />
  </a>
  <a href="https://travis-ci.org/w3tecch/typeorm-seeding">
    <img src="https://travis-ci.org/w3tecch/typeorm-seeding.svg?branch=master" alt="travis" />
  </a>
  <a href="https://ci.appveyor.com/project/dweber019/typeorm-seeding/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/f8e7jdm8v58hcwpq/branch/master?svg=true&passingText=Windows%20passing&pendingText=Windows%20pending&failingText=Windows%20failing" alt="appveyor" />
  </a>
  <a href="https://stackshare.io/hirsch88/typeorm-seeding">
    <img src="https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat" alt="StackShare" />
  </a>
</p>

<p align="center">
  <b>A delightful way to seed test data into your database.</b></br>
  <span>Inspired by the awesome framework <a href="https://laravel.com/">laravel</a> in PHP and of the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
  <sub>Made with ❤️ by <a href="https://github.com/w3tecch">w3tech</a>, <a href="https://twitter.com/GeryHirschfeld1">Gery Hirschfeld</a> and <a href="https://github.com/w3tecch/typeorm-seeding/graphs/contributors">contributors</a></sub>
</p>

<br />

![divider](./w3tec-divider.png)

## ❯ Why

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a factory for your entities (models) and a seed script.

![divider](./w3tec-divider.png)

## ❯ Installation

```bash
npm i typeorm-seeding
```

or with yarn

```bash
yarn add typeorm-seeding
```

![divider](./w3tec-divider.png)

## ❯ Usage

### 1. Create a factory for your entity

For all entities we want to seed, we need to define a factory. To do so we give you the awesome [faker](https://github.com/marak/Faker.js/) library as a parameter into your factory. Then create your "fake" entity and return it. Those factory files should be in the `src/database/factories` folder and suffixed with `Factory` like `src/database/factories/UserFactory.ts`.

Settings can be used to pass some static value into the factory.

```typescript
define(User, (faker: typeof Faker, settings: { roles: string[] }) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.roles = settings.roles;
    return user;
});
```

Handle relation in the entity factory like this.

```typescript
define(Pet, (faker: typeof Faker, settings: undefined) => {
    const gender = faker.random.number(1);
    const name = faker.name.firstName(gender);

    const pet = new Pet();
    pet.name = name;
    pet.age = faker.random.number();
    pet.user = factory(User)({ roles: ['admin'] })
    return pet;
});
```

### 2. Create a seed file

The seeds files define how much and how the data are connected with each other. The files will be executed alphabetically.
With the second function, accepting your settings defined in the factories, you are able to create different variations of entities.

```typescript
export class CreateUsers implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)({ roles: [] }).createMany(10);
    }

}
```

Here an example with nested factories. You can use the `.map()` function to alter
the generated value before they get persisted.

```typescript
...
await factory(User)()
    .map(async (user: User) => {
        const pets: Pet[] = await factory(Pet)().createMany(2);
        const petIds = pets.map((pet: Pet) => pet.Id);
        await user.pets().attach(petIds);
    })
    .createMany(5);
...
```

To deal with relations you can use the entity manager like this.

```typescript
export class CreatePets implements SeedsInterface {

    public async seed(factory: FactoryInterface, connection: Connection): Promise<any> {
        const connection = await factory.getConnection();
        const em = connection.createEntityManager();

        await times(10, async (n) => {
            // This creates a pet in the database
            const pet = await factory(Pet)().create();
            // This only returns a entity with fake data
            const user = await factory(User)({ roles: ['admin'] }).make();
            user.pets = [pet];
            await em.save(user);
        });
    }

}
```

## ❯ Example

A good example is in the [express-typescript-boilerplate](https://github.com/w3tecch/express-typescript-boilerplate) repository.

## ❯ License

[MIT](/LICENSE)
