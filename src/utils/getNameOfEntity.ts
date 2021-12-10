import { ObjectType } from 'typeorm'
import { EntityNotDefinedError } from '../errors/EntityNotDefinedError'

export const getNameOfEntity = <T>(entity: ObjectType<T>): string => {
  if (entity?.hasOwnProperty('name')) {
    return entity.name
  }

  throw new EntityNotDefinedError(entity)
}
