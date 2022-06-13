export class DataSourceNotProvidedError extends Error {
  constructor() {
    super(`Data source is not provided.`)
  }
}
