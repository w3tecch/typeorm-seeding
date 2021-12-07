import { ObjectType } from 'typeorm'

export const getNameOfEntity = <T>(entity: ObjectType<T>): string => {
  if (entity?.hasOwnProperty('name')) {
    return entity.name
  }

  throw new Error('Entity is not defined')
}
