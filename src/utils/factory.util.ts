import { ObjectType } from 'typeorm'

export const getNameOfEntity = <T>(entity: ObjectType<T>): string => {
  if (entity instanceof Function) {
    return entity.name
  } else if (entity) {
    return new (entity as any)().constructor.name
  }
  throw new Error('Enity is not defined')
}

export const isPromiseLike = (o: any): boolean =>
  !!o && (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function' && !(o instanceof Date)
