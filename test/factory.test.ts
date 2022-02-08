import type { Connection } from 'typeorm'
import { configureConnection, Factory, fetchConnection, LazyInstanceAttribute, Subfactory } from '../src'
import { Country } from './entities/Country.entity'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { CountryFactory } from './factories/Country.factory'
import { PetFactory } from './factories/Pet.factory'
import { UserFactory } from './factories/User.factory'

describe(Factory, () => {
  let connection: Connection
  const userFactory = new UserFactory()
  const petFactory = new PetFactory()
  const countryFactory = new CountryFactory()

  beforeEach(async () => {
    configureConnection({ connection: 'memory' })
    connection = await fetchConnection()

    await connection.synchronize()
  })

  afterEach(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  describe(Factory.prototype.make, () => {
    describe(CountryFactory, () => {
      test('Should make a new entity', async () => {
        const countryMaked = await countryFactory.make()

        expect(countryMaked).toBeInstanceOf(Country)
        expect(countryMaked.id).toBeUndefined()
        expect(countryMaked.name).toBeDefined()
        expect(countryMaked.isoCode).toBeDefined()
        expect(countryMaked.users).toBeUndefined()
      })

      test('Should make a new entity overriding param and using instance attr', async () => {
        const providedCountry = 'France'
        const expectedIsoCode = 'FR'
        const countryMaked = await countryFactory.make({
          name: providedCountry,
        })

        expect(countryMaked).toBeInstanceOf(Country)
        expect(countryMaked.id).toBeUndefined()
        expect(countryMaked.name).toBeDefined()
        expect(countryMaked.name).toBe(providedCountry)
        expect(countryMaked.isoCode).toBeDefined()
        expect(countryMaked.isoCode).toBe(expectedIsoCode)
        expect(countryMaked.users).toBeUndefined()
      })

      test('Should make a new entity overriding user array', async () => {
        const count = 2
        const countryMaked = await countryFactory.make({
          users: new Subfactory(UserFactory, count),
        })

        expect(countryMaked).toBeInstanceOf(Country)
        expect(countryMaked.id).toBeUndefined()
        expect(countryMaked.name).toBeDefined()
        expect(countryMaked.isoCode).toBeDefined()
        expect(countryMaked.users).toBeDefined()
        expect(countryMaked.users).toBeInstanceOf(Array)
        expect(countryMaked.users).toHaveLength(count)

        countryMaked.users?.forEach((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.id).toBeUndefined()
          expect(user.country).not.toEqual(countryMaked)
        })
      })

      test('Should make a new entity overriding user array with country lazy instance', async () => {
        const count = 2
        const countryMaked = await countryFactory.make({
          users: new LazyInstanceAttribute(
            (instance) =>
              new Subfactory(
                UserFactory,
                {
                  country: instance,
                },
                count,
              ),
          ),
        })

        expect(countryMaked).toBeInstanceOf(Country)
        expect(countryMaked.id).toBeUndefined()
        expect(countryMaked.name).toBeDefined()
        expect(countryMaked.isoCode).toBeDefined()
        expect(countryMaked.users).toBeDefined()
        expect(countryMaked.users).toBeInstanceOf(Array)
        expect(countryMaked.users).toHaveLength(count)

        countryMaked.users?.forEach((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.id).toBeUndefined()
          expect(user.country).toEqual(countryMaked)
        })
      })
    })

    describe(UserFactory, () => {
      test('Should make a new entity', async () => {
        const userMaked = await userFactory.make()

        expect(userMaked).toBeInstanceOf(User)
        expect(userMaked.id).toBeUndefined()
        expect(userMaked.name).toBeDefined()
        expect(userMaked.lastName).toBeDefined()
        expect(userMaked.email).toBeDefined()
        expect(userMaked.pets).toBeUndefined()
        expect(userMaked.country).toBeDefined()
        expect(userMaked.country).toBeInstanceOf(Country)
        expect(userMaked.country.id).toBeUndefined()
      })

      test('Should make a new entity with name overrided', async () => {
        const providedName = 'john'
        const userMaked = await userFactory.make({
          name: providedName,
        })

        expect(userMaked).toBeInstanceOf(User)
        expect(userMaked.id).toBeUndefined()
        expect(userMaked.name).toBe(providedName)
        expect(userMaked.lastName).toBeDefined()
        expect(userMaked.email).toMatch(providedName)
        expect(userMaked.pets).toBeUndefined()
        expect(userMaked.country).toBeDefined()
        expect(userMaked.country).toBeInstanceOf(Country)
        expect(userMaked.country.id).toBeUndefined()
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

      test('Should make a new entity with name overrided and owner affected', async () => {
        const petName = 'Fido'
        const petMaked = await petFactory.make({
          name: petName,
        })

        expect(petMaked).toBeInstanceOf(Pet)
        expect(petMaked.id).toBeUndefined()
        expect(petMaked.name).toBe(petName)
        expect(petMaked.owner).toBeDefined()
        expect(petMaked.owner).toBeInstanceOf(User)
        expect(petMaked.owner.id).toBeUndefined()
        expect(petMaked.owner.name).toBe(petName)
      })
    })
  })

  describe(Factory.prototype.makeMany, () => {
    test.each([
      [CountryFactory.name, countryFactory],
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
    describe(CountryFactory, () => {
      test('Should create a new entity', async () => {
        const countryCreated = await countryFactory.create()

        expect(countryCreated).toBeInstanceOf(Country)
        expect(countryCreated.id).toBeDefined()
        expect(countryCreated.name).toBeDefined()
        expect(countryCreated.isoCode).toBeDefined()
        expect(countryCreated.users).toBeUndefined()
      })

      test('Should create a new entity overriding param and using instance attr', async () => {
        const providedCountry = 'France'
        const expectedIsoCode = 'FR'
        const countryCreated = await countryFactory.create({
          name: providedCountry,
        })

        expect(countryCreated).toBeInstanceOf(Country)
        expect(countryCreated.id).toBeDefined()
        expect(countryCreated.name).toBeDefined()
        expect(countryCreated.name).toBe(providedCountry)
        expect(countryCreated.isoCode).toBeDefined()
        expect(countryCreated.isoCode).toBe(expectedIsoCode)
        expect(countryCreated.users).toBeUndefined()
      })

      test('Should create a new entity overriding user array', async () => {
        const count = 2
        const countryCreated = await countryFactory.create({
          users: new Subfactory(UserFactory, count),
        })

        expect(countryCreated).toBeInstanceOf(Country)
        expect(countryCreated.id).toBeDefined()
        expect(countryCreated.name).toBeDefined()
        expect(countryCreated.isoCode).toBeDefined()
        expect(countryCreated.users).toBeDefined()
        expect(countryCreated.users).toBeInstanceOf(Array)
        expect(countryCreated.users).toHaveLength(count)

        countryCreated.users?.forEach((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.id).toBeDefined()
          expect(user.country.id).not.toBe(countryCreated.id)
        })
      })

      test('Should create a new entity overriding user array with country lazy instance', async () => {
        const count = 2
        const countryCreated = await countryFactory.create({
          users: new LazyInstanceAttribute(
            (instance) =>
              new Subfactory(
                UserFactory,
                {
                  country: instance,
                },
                count,
              ),
          ),
        })

        expect(countryCreated).toBeInstanceOf(Country)
        expect(countryCreated.id).toBeDefined()
        expect(countryCreated.name).toBeDefined()
        expect(countryCreated.isoCode).toBeDefined()
        expect(countryCreated.users).toBeDefined()
        expect(countryCreated.users).toBeInstanceOf(Array)
        expect(countryCreated.users).toHaveLength(count)

        countryCreated.users?.forEach((user) => {
          expect(user).toBeInstanceOf(User)
          expect(user.id).toBeDefined()
          expect(user.country.id).toBe(countryCreated.id)
        })
      })
    })

    describe(UserFactory, () => {
      test('Should create a new entity', async () => {
        const userCreated = await userFactory.create()

        expect(userCreated).toBeInstanceOf(User)
        expect(userCreated.id).toBeDefined()
        expect(userCreated.name).toBeDefined()
        expect(userCreated.lastName).toBeDefined()
        expect(userCreated.email).toBeDefined()
        expect(userCreated.pets).toBeUndefined()
        expect(userCreated.country).toBeDefined()
        expect(userCreated.country).toBeInstanceOf(Country)
        expect(userCreated.country.id).toBeDefined()
      })

      test('Should create a new entity with name overrided', async () => {
        const providedName = 'john'
        const userCreated = await userFactory.create({
          name: providedName,
        })

        expect(userCreated).toBeInstanceOf(User)
        expect(userCreated.id).toBeDefined()
        expect(userCreated.name).toBe(providedName)
        expect(userCreated.lastName).toBeDefined()
        expect(userCreated.email).toMatch(providedName)
        expect(userCreated.pets).toBeUndefined()
        expect(userCreated.country).toBeDefined()
        expect(userCreated.country).toBeInstanceOf(Country)
        expect(userCreated.country.id).toBeDefined()
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
        expect(petCreated.id).toBeDefined()
        expect(petCreated.name).toBe(petName)
        expect(petCreated.owner).toBeDefined()
        expect(petCreated.owner).toBeInstanceOf(User)
        expect(petCreated.owner.id).toBeDefined()
        expect(petCreated.owner.name).toBe(petName)
      })
    })
  })

  describe(Factory.prototype.createMany, () => {
    test.each([
      [CountryFactory.name, countryFactory],
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
