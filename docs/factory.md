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

The definition function is the one that need to be defined when extending the class. It is called to instantiate the entity and the result will be used on the rest of factory lifecycle.

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
