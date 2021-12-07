import { Connection } from 'typeorm'
import { configureConnection } from '../src'
import { fetchConnection } from '../src/connection'
import { Factory } from '../src/factory'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { userFactoryFn } from './factories/UserFactoryFunction'

describe(Factory, () => {
  let connection: Connection
  let userFactory: Factory<User, any>
  let petFactory: Factory<Pet, any>
  const petFn = () => {
    const pet = new Pet()

    pet.name = 'Tobi'
    pet.owner = userFactory as any

    return pet
  }

  beforeAll(async () => {
    await configureConnection({ connection: 'memory' })
    connection = await fetchConnection({ entities: ['test/entities/**/*.ts'] })

    await connection.synchronize()
  })

  beforeEach(() => {
    userFactory = new Factory<User, any>(User, userFactoryFn)
    petFactory = new Factory<Pet, any>(Pet, petFn)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  describe(Factory.prototype.make, () => {
    test('Should raise an error if there are no factory defined', () => {
      const nullishFactory = new Factory<User, any>(User, null as any)

      expect(nullishFactory.make()).rejects.toThrow(Error)
    })

    test('Should make a new entity', async () => {
      const userMaked = await userFactory.make()

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.id).toBeUndefined()
      expect(userMaked.name).toBe('John Doe')
    })

    test('Should make a new entity related with another factory', async () => {
      const petMaked = await petFactory.make()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.name).toBe('Tobi')
      expect(petMaked.owner).toBeInstanceOf(User)
      expect(petMaked.owner.name).toBe('John Doe')
    })

    test('Should make a new entity with map function', async () => {
      const mapFunction = (user: User) => {
        user.name = 'Jane Doe'
        return Promise.resolve(user)
      }
      const userMaked = await userFactory.map(mapFunction).make()

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('Jane Doe')
    })

    test('Should make a new entity overriding params', async () => {
      const userMaked = await userFactory.make({ name: 'Jane Doe' })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('Jane Doe')
    })

    test('Should make a new entity overriding params with promise value', async () => {
      const userMaked = await userFactory.make({ name: Promise.resolve('Jane Doe') as any })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('Jane Doe')
    })
  })

  describe(Factory.prototype.makeMany, () => {
    test.each([0, 2])('Should make %d new entities', async (qty) => {
      const usersMaked = await userFactory.makeMany(qty)

      expect(usersMaked).toHaveLength(qty)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe('John Doe')
      })
    })

    test('Should make many new entities overriding params', async () => {
      const usersMaked = await userFactory.makeMany(2, { name: 'Jane Doe' })

      expect(usersMaked).toHaveLength(2)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe('Jane Doe')
      })
    })
  })

  describe(Factory.prototype.create, () => {
    test('Should create a new entity', async () => {
      const userCreated = await userFactory.create()

      expect(userCreated).toBeInstanceOf(User)
      expect(userCreated.id).toBeDefined()
      expect(userCreated.name).toBe('John Doe')
    })

    test('Should make a new entity related with another factory', async () => {
      const petMaked = await petFactory.create()

      expect(petMaked).toBeInstanceOf(Pet)
      expect(petMaked.name).toBe('Tobi')
      expect(petMaked.owner).toBeInstanceOf(User)
      expect(petMaked.owner.name).toBe('John Doe')
    })

    test('Should make a new entity overriding params', async () => {
      const userMaked = await userFactory.create({ name: 'Jane Doe' })

      expect(userMaked).toBeInstanceOf(User)
      expect(userMaked.name).toBe('Jane Doe')
    })
  })

  describe(Factory.prototype.createMany, () => {
    test.each([0, 2])('Should create %d new entities', async (qty) => {
      const usersMaked = await userFactory.createMany(qty)

      expect(usersMaked).toHaveLength(qty)
      usersMaked.forEach((user) => {
        expect(user).toBeInstanceOf(User)
        expect(user.name).toBe('John Doe')
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
