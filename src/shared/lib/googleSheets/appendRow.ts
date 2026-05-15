import { getGoogleSheetsConfig } from "./config"
import { getGoogleSheetsClient } from "./client"
import { GoogleSheetsAppendError, GoogleSheetsValidationError } from "./errors"

export type GoogleSheetCellValue = number | string

export type AppendGoogleSheetRowInput = {
  range: string
  values: readonly GoogleSheetCellValue[]
}

function normalizeCellValue(value: GoogleSheetCellValue): GoogleSheetCellValue {
  return typeof value === "string" ? value.trim() : value
}

function normalizeRange(range: string): string {
  const normalizedRange = range.trim()

  if (!normalizedRange) {
    throw new GoogleSheetsValidationError("Google Sheets range is required")
  }

  return normalizedRange
}

function normalizeValues(
  values: readonly GoogleSheetCellValue[]
): GoogleSheetCellValue[] {
  if (values.length === 0) {
    throw new GoogleSheetsValidationError(
      "Google Sheets row values are required"
    )
  }

  const normalizedValues = values.map(normalizeCellValue)
  const hasEmptyStringValue = normalizedValues.some(
    (value) => typeof value === "string" && value.length === 0
  )

  if (hasEmptyStringValue) {
    throw new GoogleSheetsValidationError(
      "Google Sheets row values cannot contain empty strings"
    )
  }

  return normalizedValues
}

export async function appendGoogleSheetRow({
  range,
  values,
}: AppendGoogleSheetRowInput): Promise<void> {
  const normalizedRange = normalizeRange(range)
  const normalizedValues = normalizeValues(values)
  const { spreadsheetId } = getGoogleSheetsConfig()
  const sheets = getGoogleSheetsClient()

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: normalizedRange,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [normalizedValues],
      },
    })
  } catch (error: unknown) {
    throw new GoogleSheetsAppendError(
      "Failed to append row to Google Sheets",
      error
    )
  }
}
