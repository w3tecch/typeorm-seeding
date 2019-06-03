import { printError } from './log.util'
import { ObjectType } from 'typeorm'

/**
 * Returns the name of a class
 */
export const getNameOfClass = <T>(objectType: ObjectType<T>): string => {
  if (objectType instanceof Function) {
    return objectType.name
  } else if (objectType) {
    return new (objectType as any)().constructor.name
  }
  throw new Error('Enity is not defined')
}

/**
 * Checks if the given argument is a promise
 */
export const isPromiseLike = (o: any): boolean =>
  !!o && (typeof o === 'object' || typeof o === 'function') && typeof o.then === 'function' && !(o instanceof Date)
