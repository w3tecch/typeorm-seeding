import { ObjectType } from 'typeorm'
import { FactoryNotDefinedError } from './errors/FactoryNotDefinedError'
import { Factory } from './factory'
import { FactoryFunction } from './types'
import { getNameOfEntity } from './utils/getNameOfEntity'

const factoriesMap: Map<string, FactoryFunction<any, any>> = new Map()

export function define<Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) {
  factoriesMap.set(getNameOfEntity(entity), factoryFn)
}

export function factory<Entity, Context>(entity: ObjectType<Entity>) {
  return (context?: Context) => {
    const name = getNameOfEntity(entity)

    const factoryFunction = factoriesMap.get(name)
    if (!factoryFunction) {
      throw new FactoryNotDefinedError(name)
    }

    return new Factory<Entity, Context>(entity, factoryFunction, context)
  }
}

export function clearFactories() {
  factoriesMap.clear()
}
