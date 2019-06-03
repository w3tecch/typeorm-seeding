/**
 * Returns the name of a class
 */
export const getNameOfClass = (c: any): string => new c().constructor.name

/**
 * Checks if the given argument is a promise
 */
export const isPromiseLike = (o: any): boolean =>
  !!o &&
  (typeof o === 'object' || typeof o === 'function') &&
  typeof o.then === 'function' &&
  !(o instanceof Date)
