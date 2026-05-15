import { google, type sheets_v4 } from "googleapis"

import { getGoogleSheetsConfig } from "./config"

const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets"

let cachedClient: sheets_v4.Sheets | null = null

export function getGoogleSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) {
    return cachedClient
  }

  const config = getGoogleSheetsConfig()

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: [GOOGLE_SHEETS_SCOPE],
  })

  cachedClient = google.sheets({
    auth,
    version: "v4",
  })

  return cachedClient
}
