export class GoogleSheetsConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GoogleSheetsConfigError"
  }
}

export class GoogleSheetsAppendError extends Error {
  readonly cause: unknown

  constructor(message: string, cause: unknown) {
    super(message)
    this.name = "GoogleSheetsAppendError"
    this.cause = cause
  }
}

export class GoogleSheetsValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GoogleSheetsValidationError"
  }
}
