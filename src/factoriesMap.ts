import { ObjectType } from 'typeorm'
import { FactoryNotDefinedError } from './errors/FactoryNotDefinedError'
import { Factory } from './factory'
import { FactoryFunction } from './types'
import { getNameOfEntity } from './utils/getNameOfEntity'

const factoriesMap: Map<string, FactoryFunction<any>> = new Map()

export function define<Entity>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity>) {
  factoriesMap.set(getNameOfEntity(entity), factoryFn)
}

export function factory<Entity>(entity: ObjectType<Entity>) {
  const name = getNameOfEntity(entity)

  const factoryFunction = factoriesMap.get(name)
  if (!factoryFunction) {
    throw new FactoryNotDefinedError(name)
  }

  return new Factory<Entity>(entity, factoryFunction)
}
