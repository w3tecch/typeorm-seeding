export class EntityNotDefinedError extends Error {
  constructor(entity: any) {
    super(`Entity ${String(entity)} is not defined`)
  }
}
