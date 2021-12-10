import { ObjectType } from 'typeorm'
import { FactoryNotDefinedError } from './errors/FactoryNotDefinedError'
import { Factory } from './factory'
import { FactoryFunction, ContextFactoryFunction } from './types'
import { getNameOfEntity } from './utils/getNameOfEntity'

const factoriesMap: Map<string, FactoryFunction<any, any>> = new Map()

export const define = <Entity, Context>(entity: ObjectType<Entity>, factoryFn: FactoryFunction<Entity, Context>) => {
  factoriesMap.set(getNameOfEntity(entity), factoryFn)
}

export const factory: ContextFactoryFunction =
  <Entity, Context>(entity: ObjectType<Entity>) =>
  (context?: Context) => {
    const name = getNameOfEntity(entity)

    const factory = factoriesMap.get(name)
    if (!factory) {
      throw new FactoryNotDefinedError(name)
    }

    return new Factory<Entity, Context>(entity, factory, context)
  }

export const clearFactories = () => {
  factoriesMap.clear()
}
