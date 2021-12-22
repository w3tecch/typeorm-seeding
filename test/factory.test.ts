import type { Connection } from 'typeorm'
import { configureConnection, Factory, fetchConnection } from '../src'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { PetFactory } from './factories/Pet.factory'
import { UserFactory } from './factories/User.factory'

describe(Factory, () => {
  let connection: Connection
  const userFactory = new UserFactory()
  const petFactory = new PetFactory()

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
    test('Should make a new entity', async () => {
      const userMaked = await userFactory.make()

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.id).toBeUndefined()
      expect(userMaked.name).toBeDefined()
    })

    test('Should make a new entity related with another factory', async () => {
      const petMaked = await petFactory.make()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.owner).toBeInstanceOf(User)
      expect(petMaked.owner.name).toBeDefined()
    })

    test('Should make a new entity with map function', async () => {
      const mockFn = jest.fn()
      const userMaked = await userFactory.map(mockFn).make()

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBeDefined()
      expect(mockFn).toHaveBeenCalled()
    })

    test('Should make a new entity overriding params', async () => {
      const userMaked = await userFactory.make({ name: 'John Doe' })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('John Doe')
    })

    test('Should make a new entity overriding params with promise value', async () => {
      const userMaked = await userFactory.make({ name: Promise.resolve('John Doe') as any })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('John Doe')
    })
  })

  describe(Factory.prototype.makeMany, () => {
    test.each([0, 2])('Should make %d new entities', async (qty) => {
      const usersMaked = await userFactory.makeMany(qty)

      expect(usersMaked).toHaveLength(qty)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBeDefined()
      })
    })

    test('Should make many new entities overriding params', async () => {
      const usersMaked = await userFactory.makeMany(2, { name: 'John Doe' })

      expect(usersMaked).toHaveLength(2)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe('John Doe')
      })
    })
  })

  describe(Factory.prototype.create, () => {
    test('Should create a new entity', async () => {
      const userCreated = await userFactory.create()

      expect(userCreated).toBeInstanceOf(User)
      expect(userCreated.id).toBeDefined()
      expect(userCreated.name).toBeDefined()
    })

    test('Should make a new entity related with another factory', async () => {
      const petMaked = await petFactory.create()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.owner).toBeInstanceOf(User)
      expect(petMaked.owner.id).toBeDefined()
      expect(petMaked.owner.name).toBeDefined()
    })

    test('Should make a new entity overriding params', async () => {
      const userMaked = await userFactory.create({ name: 'John Doe' })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('John Doe')
    })
  })

  describe(Factory.prototype.createMany, () => {
    test.each([0, 2])('Should create %d new entities', async (qty) => {
      const usersMaked = await userFactory.createMany(qty)

      expect(usersMaked).toHaveLength(qty)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBeDefined()
      })
    })

    test('Should create many new entities overriding params', async () => {
      const usersMaked = await userFactory.createMany(2, { name: 'Jane Doe' })

      expect(usersMaked).toHaveLength(2)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe('Jane Doe')
      })
    })
  })
})
