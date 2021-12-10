export class FactoryNotDefinedError extends Error {
  constructor(factory: string) {
    super(`Factory ${factory} is not defined`)
  }
}
