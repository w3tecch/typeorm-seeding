import { Factory, InstanceAttribute, LazyInstanceAttribute, Subfactory, useDataSource } from '../src'
import { dataSource } from './fixtures/dataSource'
import { Pet } from './fixtures/Pet.entity'
import { PetFactory } from './fixtures/Pet.factory'
import { User } from './fixtures/User.entity'
import { UserFactory } from './fixtures/User.factory'

describe(Factory, () => {
  describe(Factory.prototype.make, () => {
    describe(UserFactory, () => {
      const factory = new UserFactory()

      test('Should make a new entity', async () => {
        const userMaked = await factory.make()

        expect(userMaked).toBeInstanceOf(User)
        expect(userMaked.id).toBeUndefined()
        expect(userMaked.name).toBeDefined()
        expect(userMaked.lastName).toBeDefined()
        expect(userMaked.age).toBeDefined()
        expect(userMaked.email).toBeDefined()

        expect(userMaked.pets).toBeInstanceOf(Array)
        expect(userMaked.pets).toHaveLength(0)
      })

      test('Should make a new entity with attribute overrided', async () => {
        const userMaked = await factory.make({
          name: 'john',
        })

        expect(userMaked.name).toBe('john')
      })

      test('Should make a new entity with function as attribute', async () => {
        const userMaked = await factory.make({
          name: () => 'john',
        })

        expect(userMaked.name).toBe('john')
      })

      test('Should make a new entity with async function as attribute', async () => {
        const userMaked = await factory.make({
          name: async () => 'john',
        })

        expect(userMaked.name).toBe('john')
      })

      test('Should make a new entity with instance attributes', async () => {
        const userMaked = await factory.make({
          email: new InstanceAttribute((instance) =>
            [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
          ),
        })

        expect(userMaked.email).toMatch(userMaked.name.toLowerCase())
        expect(userMaked.email).toMatch(userMaked.lastName.toLowerCase())
      })

      test('Should make a new entity with lazy instance attributes', async () => {
        const userMaked = await factory.make({
          email: new InstanceAttribute((instance) =>
            [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
          ),
        })

        expect(userMaked.email).toMatch(userMaked.name.toLowerCase())
        expect(userMaked.email).toMatch(userMaked.lastName.toLowerCase())
      })

      test('Should make a new entity with multiple subfactories', async () => {
        const userMaked = await factory.make({
          pets: new LazyInstanceAttribute((instance) => new Subfactory(PetFactory, { owner: instance }, 1)),
        })

        expect(userMaked.pets).toBeInstanceOf(Array)
        expect(userMaked.pets).toHaveLength(1)
        userMaked.pets.forEach(async (pet) => {
          expect(pet.id).toBeUndefined()
          expect(pet.owner).toBeInstanceOf(User)
          expect(pet.owner.id).toBeUndefined()
        })
      })

      test('Should make two entities with different attributes', async () => {
        const userMaked1 = await factory.make()
        const userMaked2 = await factory.make()

        expect(userMaked1).not.toStrictEqual(userMaked2)
      })
    })

    describe(PetFactory, () => {
      const factory = new PetFactory()

      test('Should make a new entity with single subfactory', async () => {
        const petMaked = await factory.make()

        expect(petMaked).toBeInstanceOf(Pet)
        expect(petMaked.id).toBeUndefined()
        expect(petMaked.name).toBeDefined()
        expect(petMaked.owner).toBeDefined()
        expect(petMaked.owner).toBeInstanceOf(User)
        expect(petMaked.owner.id).toBeUndefined()
      })
    })
  })

  describe(Factory.prototype.makeMany, () => {
    test('Should make many new entities', async () => {
      const count = 2
      const factory = new UserFactory()
      const entitiesMaked = await factory.makeMany(count)

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
      })
    })
  })

  describe(Factory.prototype.create, () => {
    beforeAll(async () => {
      await useDataSource(dataSource, { synchronize: true }, true)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })

    describe(UserFactory, () => {
      const factory = new UserFactory()

      test('Should create a new entity', async () => {
        const userCreated = await factory.create()

        expect(userCreated).toBeInstanceOf(User)
        expect(userCreated.id).toBeDefined()
        expect(userCreated.name).toBeDefined()
        expect(userCreated.lastName).toBeDefined()
        expect(userCreated.age).toBeDefined()
        expect(userCreated.email).toBeDefined()

        expect(userCreated.pets).toBeInstanceOf(Array)
        expect(userCreated.pets).toHaveLength(0)
      })

      test('Should create a new entity with attribute overrided', async () => {
        const userCreated = await factory.create({
          name: 'john',
        })

        expect(userCreated.name).toBe('john')
      })

      test('Should create a new entity with function as attribute', async () => {
        const userCreated = await factory.create({
          name: () => 'john',
        })

        expect(userCreated.name).toBe('john')
      })

      test('Should create a new entity with async function as attribute', async () => {
        const userCreated = await factory.create({
          name: async () => 'john',
        })

        expect(userCreated.name).toBe('john')
      })

      test('Should create a new entity with instance attributes', async () => {
        const userCreated = await factory.create({
          email: new InstanceAttribute((instance) =>
            [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
          ),
        })

        expect(userCreated.email).toMatch(userCreated.name.toLowerCase())
        expect(userCreated.email).toMatch(userCreated.lastName.toLowerCase())
      })

      test('Should create a new entity with lazy instance attributes', async () => {
        const userCreated = await factory.create({
          email: new InstanceAttribute((instance) =>
            [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
          ),
        })

        expect(userCreated.email).toMatch(userCreated.name.toLowerCase())
        expect(userCreated.email).toMatch(userCreated.lastName.toLowerCase())
      })

      test('Should create a new entity with multiple subfactories', async () => {
        const userCreated = await factory.create({
          pets: new LazyInstanceAttribute((instance) => new Subfactory(PetFactory, { owner: instance }, 1)),
        })

        expect(userCreated.pets).toBeInstanceOf(Array)
        expect(userCreated.pets).toHaveLength(1)
        userCreated.pets.forEach(async (pet) => {
          expect(pet.id).toBeDefined()
          expect(pet.owner).toBeInstanceOf(User)
          expect(pet.owner.id).toBeDefined()
          expect(pet.owner.id).toBe(userCreated.id)
        })
      })

      test('Should create two entities with different attributes', async () => {
        const userCreated1 = await factory.create()
        const userCreated2 = await factory.create()

        expect(userCreated1).not.toStrictEqual(userCreated2)
      })
    })

    describe(PetFactory, () => {
      const factory = new PetFactory()

      test('Should create a new entity with single subfactory', async () => {
        const petCreated = await factory.create()

        expect(petCreated).toBeInstanceOf(Pet)
        expect(petCreated.id).toBeDefined()
        expect(petCreated.name).toBeDefined()
        expect(petCreated.owner).toBeDefined()
        expect(petCreated.owner).toBeInstanceOf(User)
        expect(petCreated.owner.id).toBeDefined()
      })
    })
  })

  describe(Factory.prototype.createMany, () => {
    beforeAll(async () => {
      await useDataSource(dataSource, { synchronize: true }, true)
    })

    afterAll(async () => {
      await dataSource.destroy()
    })

    test('Should create many new entities', async () => {
      const count = 2
      const factory = new UserFactory()
      const entitiesCreated = await factory.createMany(count)

      expect(entitiesCreated).toHaveLength(count)
      entitiesCreated.forEach((entity) => {
        expect(entity.id).toBeDefined()
      })
    })
  })
})
