export class SecretMissingError extends Error {
  constructor(path: string) {
    super(`${path} is missing`)
  }
}