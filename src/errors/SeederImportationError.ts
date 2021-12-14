export class SeederImportationError extends Error {
  constructor(message: string) {
    super(`Error importing seeders: ${message}`)
  }
}
