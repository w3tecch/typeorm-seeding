export class DefaultSeederNotDefinedError extends Error {
  constructor() {
    super(`Default seeder is not defined.`)
  }
}
