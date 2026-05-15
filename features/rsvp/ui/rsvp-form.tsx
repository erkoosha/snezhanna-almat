"use client"

import * as React from "react"
import type { ZodError } from "zod"

import {
  getRsvpSubmitErrorMessage,
  rsvpStatusOptions,
  type RsvpSubmission,
  rsvpSubmissionSchema,
  type RsvpSubmitResponse,
} from "@/features/rsvp/model/rsvp"

import styles from "./rsvp-form.module.css"

type RsvpFormProps = {
  attendanceLegend: string
  guestNameLabel: string
  guestNamePlaceholder: string
  note: string
  submitLabel: string
  submittedLabel: string
}

type SubmitState = "idle" | "submitting" | "success"

class RsvpSubmitClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RsvpSubmitClientError"
  }
}

function getStringFormValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : ""
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isRsvpSubmitResponse(value: unknown): value is RsvpSubmitResponse {
  if (!isRecord(value) || typeof value.ok !== "boolean") {
    return false
  }

  if (value.ok) {
    return true
  }

  if (!isRecord(value.error)) {
    return false
  }

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  )
}

async function readRsvpSubmitResponse(
  response: Response
): Promise<RsvpSubmitResponse> {
  try {
    const body: unknown = await response.json()

    if (isRsvpSubmitResponse(body)) {
      return body
    }
  } catch {
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Не удалось прочитать ответ сервера",
      },
    }
  }

  return {
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Сервер вернул некорректный ответ",
    },
  }
}

function getFirstValidationMessage(error: ZodError<RsvpSubmission>): string {
  const { fieldErrors, formErrors } = error.flatten()

  return (
    fieldErrors.guestName?.[0] ??
    fieldErrors.status?.[0] ??
    formErrors[0] ??
    "Проверьте данные формы"
  )
}

export function RsvpForm({
  attendanceLegend,
  guestNameLabel,
  guestNamePlaceholder,
  note,
  submitLabel,
  submittedLabel,
}: RsvpFormProps) {
  const [submitState, setSubmitState] = React.useState<SubmitState>("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const isSubmitting = submitState === "submitting"
  const isSubmitted = submitState === "success"
  const buttonLabel = isSubmitted
    ? submittedLabel
    : isSubmitting
      ? "отправляем..."
      : submitLabel

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const parsedPayload = rsvpSubmissionSchema.safeParse({
      guestName: getStringFormValue(formData.get("guest_name")),
      status: getStringFormValue(formData.get("status")),
    })

    if (!parsedPayload.success) {
      setErrorMessage(getFirstValidationMessage(parsedPayload.error))
      return
    }

    setSubmitState("submitting")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedPayload.data),
      })
      const responseBody = await readRsvpSubmitResponse(response)
      const submitErrorMessage = getRsvpSubmitErrorMessage(responseBody)

      if (!response.ok || submitErrorMessage) {
        throw new RsvpSubmitClientError(
          submitErrorMessage ?? "Не удалось отправить анкету"
        )
      }

      setSubmitState("success")
    } catch (error: unknown) {
      setSubmitState("idle")
      setErrorMessage(
        error instanceof RsvpSubmitClientError
          ? error.message
          : "Не удалось отправить анкету. Попробуйте еще раз"
      )
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.field}>
        <span className="sr-only">{guestNameLabel}</span>
        <input
          type="text"
          name="guest_name"
          placeholder={guestNamePlaceholder}
          required
          disabled={isSubmitting || isSubmitted}
        />
      </label>

      <p className={styles.note}>{note}</p>

      <fieldset className={styles.checkboxes}>
        <legend className="sr-only">{attendanceLegend}</legend>
        {rsvpStatusOptions.map((option) => (
          <label key={option.status}>
            <input
              type="radio"
              name="status"
              value={option.status}
              required
              disabled={isSubmitting || isSubmitted}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={isSubmitting || isSubmitted}
      >
        {buttonLabel}
      </button>
    </form>
  )
}
