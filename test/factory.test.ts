import type { Connection } from 'typeorm'
import { configureConnection, Factory, fetchConnection, Subfactory } from '../src'
import { Pet } from './fixtures/Pet.entity'
import { PetFactory } from './fixtures/Pet.factory'
import { User } from './fixtures/User.entity'
import { UserFactory } from './fixtures/User.factory'

describe(Factory, () => {
  const userFactory = new UserFactory()
  const petFactory = new PetFactory()

  describe(Factory.prototype.make, () => {
    describe(UserFactory, () => {
      test('Should make a new entity', async () => {
        const userMaked = await userFactory.make()

        expect(userMaked).toBeInstanceOf(User)
        expect(userMaked.id).toBeUndefined()
        expect(userMaked.name).toBeDefined()
        expect(userMaked.lastName).toBeDefined()
        expect(userMaked.age).toBeDefined()
        expect(userMaked.email).toBeDefined()

        expect(userMaked.pets).toBeInstanceOf(Array)
        userMaked.pets.forEach((pet) => {
          expect(pet).toBeInstanceOf(Pet)
          expect(pet.id).toBeUndefined()
          expect(pet.owner).toBeDefined()
          expect(pet.owner).toBeInstanceOf(User)
          expect(pet.owner).toEqual(userMaked)
        })
      })

      test('Should make a new entity with name overrided', async () => {
        const providedName = 'john'
        const userMaked = await userFactory.make({
          name: providedName,
        })

        expect(userMaked).toBeInstanceOf(User)
        expect(userMaked.name).toBe(providedName)
        expect(userMaked.email).toMatch(providedName)
      })
    })

    describe(PetFactory, () => {
      test('Should make a new entity', async () => {
        const petMaked = await petFactory.make()

        expect(petMaked).toBeInstanceOf(Pet)
        expect(petMaked.id).toBeUndefined()
        expect(petMaked.name).toBeDefined()
        expect(petMaked.owner).toBeDefined()
        expect(petMaked.owner).toBeInstanceOf(User)
        expect(petMaked.owner.id).toBeUndefined()
      })

      test('Should make a new entity with name overrided', async () => {
        const petName = 'Fido'
        const petMaked = await petFactory.make({
          name: petName,
        })

        expect(petMaked).toBeInstanceOf(Pet)
        expect(petMaked.name).toBe(petName)
      })
    })
  })

  describe(Factory.prototype.makeMany, () => {
    test.each([
      [UserFactory.name, userFactory],
      [PetFactory.name, petFactory],
    ])('Should make many new entities of %s', async (_, factory) => {
      const count = 2
      const entitiesMaked = await factory.makeMany(count)

      expect(entitiesMaked).toHaveLength(count)
      entitiesMaked.forEach((entity) => {
        expect(entity.id).toBeUndefined()
      })
    })
  })

  describe(Factory.prototype.create, () => {
    let connection: Connection

    beforeEach(async () => {
      configureConnection({ connection: 'memory' })
      connection = await fetchConnection()

      await connection.synchronize()
    })

    afterEach(async () => {
      await connection.dropDatabase()
      await connection.close()
    })

    describe(UserFactory, () => {
      test('Should create a new entity', async () => {
        const userCreated = await userFactory.create()

        expect(userCreated).toBeInstanceOf(User)
        expect(userCreated.id).toBeDefined()
        expect(userCreated.name).toBeDefined()
        expect(userCreated.lastName).toBeDefined()
        expect(userCreated.age).toBeDefined()
        expect(userCreated.email).toBeDefined()

        expect(userCreated.pets).toBeInstanceOf(Array)
        userCreated.pets.forEach((pet) => {
          expect(pet).toBeInstanceOf(Pet)
          expect(pet.id).toBeDefined()
          expect(pet.owner).toBeDefined()
          expect(pet.owner).toBeInstanceOf(User)
          expect(pet.owner.id).toEqual(userCreated.id)
        })
      })

      test('Should create a new entity with name overrided', async () => {
        const providedName = 'john'
        const userCreated = await userFactory.create({
          name: providedName,
        })

        expect(userCreated).toBeInstanceOf(User)
        expect(userCreated.name).toBe(providedName)
        expect(userCreated.email).toMatch(providedName)
      })

      test('Should create a new entity with pets overrided', async () => {
        const userCreated = await userFactory.create({
          pets: new Subfactory(PetFactory, 5),
        })

        expect(userCreated.pets).toBeInstanceOf(Array)
        userCreated.pets.forEach((pet) => {
          expect(pet).toBeInstanceOf(Pet)
          expect(pet.owner).toBeInstanceOf(User)
          expect(pet.owner.id).not.toEqual(userCreated.id)
        })
      })
    })

    describe(PetFactory, () => {
      test('Should create a new entity', async () => {
        const petCreated = await petFactory.create()

        expect(petCreated).toBeInstanceOf(Pet)
        expect(petCreated.id).toBeDefined()
        expect(petCreated.name).toBeDefined()
        expect(petCreated.owner).toBeDefined()
        expect(petCreated.owner).toBeInstanceOf(User)
        expect(petCreated.owner.id).toBeDefined()
      })

      test('Should create a new entity with name overrided and owner affected', async () => {
        const petName = 'Fido'
        const petCreated = await petFactory.create({
          name: petName,
        })

        expect(petCreated).toBeInstanceOf(Pet)
        expect(petCreated.name).toBe(petName)
      })
    })
  })

  describe(Factory.prototype.createMany, () => {
    let connection: Connection

    beforeEach(async () => {
      configureConnection({ connection: 'memory' })
      connection = await fetchConnection()

      await connection.synchronize()
    })

    afterEach(async () => {
      await connection.dropDatabase()
      await connection.close()
    })

    test.each([
      [UserFactory.name, userFactory],
      [PetFactory.name, petFactory],
    ])('Should create many new entities of %s', async (_, factory) => {
      const count = 2
      const entitiesCreated = await factory.createMany(count)

      expect(entitiesCreated).toHaveLength(count)
      entitiesCreated.forEach((entity) => {
        expect(entity.id).toBeDefined()
      })
    })
  })
})
