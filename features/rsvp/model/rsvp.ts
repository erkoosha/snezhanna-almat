import { z } from "zod"

export const rsvpStatusSchema = z.enum(["yes", "plus_one", "no"], {
  error: "Выберите один из вариантов присутствия",
})

export type RsvpStatus = z.infer<typeof rsvpStatusSchema>

export const rsvpStatusLabelByStatus = {
  yes: "Я с удовольствием приду",
  plus_one: "Приду с парой",
  no: "К сожалению, не смогу присутствовать",
} satisfies Record<RsvpStatus, string>

export const rsvpGuestCountByStatus = {
  yes: 1,
  plus_one: 2,
  no: 0,
} satisfies Record<RsvpStatus, number>

export type RsvpOption = {
  label: string
  status: RsvpStatus
}

export const rsvpStatusOptions: readonly RsvpOption[] =
  rsvpStatusSchema.options.map((status) => ({
    label: rsvpStatusLabelByStatus[status],
    status,
  }))

export const rsvpSubmissionSchema = z
  .object({
    guestName: z
      .string({ error: "Укажите имя и фамилию" })
      .trim()
      .min(1, "Укажите имя и фамилию")
      .max(120, "Имя слишком длинное"),
    status: rsvpStatusSchema,
  })
  .strict()

export type RsvpSubmission = z.infer<typeof rsvpSubmissionSchema>

export type RsvpFieldErrors = Partial<
  Record<keyof RsvpSubmission, readonly string[]>
>

export type RsvpSubmitErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "CONFIGURATION_ERROR"
  | "SHEETS_ERROR"
  | "INTERNAL_ERROR"
  | "METHOD_NOT_ALLOWED"

export type RsvpSubmitSuccessResponse = {
  ok: true
}

export type RsvpSubmitErrorResponse = {
  error: {
    code: RsvpSubmitErrorCode
    fieldErrors?: RsvpFieldErrors
    formErrors?: readonly string[]
    message: string
  }
  ok: false
}

export type RsvpSubmitResponse =
  | RsvpSubmitErrorResponse
  | RsvpSubmitSuccessResponse

export type RsvpSheetRow = readonly [
  answeredAt: string,
  guestName: string,
  statusLabel: string,
  guestCount: number,
]

const almatyDateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  timeZone: "Asia/Almaty",
  year: "numeric",
})

export function getRsvpStatusLabel(status: RsvpStatus): string {
  return rsvpStatusLabelByStatus[status]
}

export function getRsvpGuestCount(status: RsvpStatus): number {
  return rsvpGuestCountByStatus[status]
}

export function formatRsvpAnsweredAt(date: Date): string {
  return almatyDateTimeFormatter.format(date)
}

export function createRsvpSheetRow(
  submission: RsvpSubmission,
  answeredAt: Date = new Date()
): RsvpSheetRow {
  return [
    formatRsvpAnsweredAt(answeredAt),
    submission.guestName.trim(),
    getRsvpStatusLabel(submission.status),
    getRsvpGuestCount(submission.status),
  ]
}

export function getRsvpSubmitErrorMessage(
  response: RsvpSubmitResponse
): string | null {
  return response.ok ? null : response.error.message
}
