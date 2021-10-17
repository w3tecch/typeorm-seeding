import { ObjectType } from 'typeorm'

export const getNameOfEntity = <T>(entity: ObjectType<T>): string => {
  if (entity instanceof Function) {
    return entity.name
  } else if (entity) {
    return new (entity as any)().constructor.name
  }
  throw new Error('Entity is not defined')
}

export const isPromiseLike = (o: any): o is Promise<any> =>
  o && Object.prototype.toString.call(o) === '[object Promise]'
