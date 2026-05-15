import { GoogleSheetsConfigError } from "./errors"

type GoogleSheetsEnvName =
  | "GOOGLE_CLIENT_EMAIL"
  | "GOOGLE_PRIVATE_KEY"
  | "GOOGLE_SHEET_ID"

export type GoogleSheetsConfig = {
  clientEmail: string
  privateKey: string
  spreadsheetId: string
}

function readRequiredEnv(name: GoogleSheetsEnvName): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new GoogleSheetsConfigError(`${name} is required`)
  }

  return value
}

function normalizePrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, "\n")
}

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const privateKey = normalizePrivateKey(readRequiredEnv("GOOGLE_PRIVATE_KEY"))

  if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new GoogleSheetsConfigError("GOOGLE_PRIVATE_KEY has invalid format")
  }

  return {
    clientEmail: readRequiredEnv("GOOGLE_CLIENT_EMAIL"),
    privateKey,
    spreadsheetId: readRequiredEnv("GOOGLE_SHEET_ID"),
  }
}
