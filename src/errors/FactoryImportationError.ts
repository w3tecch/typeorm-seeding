export class FactoryImportationError extends Error {
  constructor(message: string) {
    super(`Error importing factories: ${message}`)
  }
}
