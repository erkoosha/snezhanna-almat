import { NextResponse } from "next/server"

import {
  createRsvpSheetRow,
  type RsvpSubmitResponse,
  rsvpSubmissionSchema,
} from "@/features/rsvp/model/rsvp"
import {
  appendGoogleSheetRow,
  GoogleSheetsAppendError,
  GoogleSheetsConfigError,
  GoogleSheetsValidationError,
} from "@/src/shared/lib/googleSheets"

export const runtime = "nodejs"

const RSVP_SHEET_RANGE = "RSVP!A:D"

class InvalidJsonError extends Error {
  constructor() {
    super("Request body must be valid JSON")
    this.name = "InvalidJsonError"
  }
}

function jsonResponse(
  body: RsvpSubmitResponse,
  init?: ResponseInit
): NextResponse<RsvpSubmitResponse> {
  return NextResponse.json<RsvpSubmitResponse>(body, init)
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return (await request.json()) as unknown
  } catch {
    throw new InvalidJsonError()
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<RsvpSubmitResponse>> {
  try {
    const body = await readJsonBody(request)
    const parsedBody = rsvpSubmissionSchema.safeParse(body)

    if (!parsedBody.success) {
      const { fieldErrors, formErrors } = parsedBody.error.flatten()

      return jsonResponse(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Проверьте данные формы",
            fieldErrors,
            formErrors,
          },
        },
        { status: 400 }
      )
    }

    const sheetRow = createRsvpSheetRow(parsedBody.data)

    await appendGoogleSheetRow({
      range: RSVP_SHEET_RANGE,
      values: sheetRow,
    })

    return jsonResponse({ ok: true }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof InvalidJsonError) {
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "INVALID_JSON",
            message: "Тело запроса должно быть валидным JSON",
          },
        },
        { status: 400 }
      )
    }

    if (error instanceof GoogleSheetsConfigError) {
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "CONFIGURATION_ERROR",
            message: "Сервер временно не готов принять ответ",
          },
        },
        { status: 500 }
      )
    }

    if (
      error instanceof GoogleSheetsAppendError ||
      error instanceof GoogleSheetsValidationError
    ) {
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "SHEETS_ERROR",
            message: "Не удалось сохранить ответ. Попробуйте еще раз",
          },
        },
        { status: 502 }
      )
    }

    return jsonResponse(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Не удалось отправить анкету. Попробуйте еще раз",
        },
      },
      { status: 500 }
    )
  }
}

export function GET(): NextResponse<RsvpSubmitResponse> {
  return jsonResponse(
    {
      ok: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Метод не поддерживается",
      },
    },
    {
      headers: {
        Allow: "POST",
      },
      status: 405,
    }
  )
}
