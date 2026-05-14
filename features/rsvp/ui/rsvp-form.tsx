"use client"

import * as React from "react"

import styles from "./rsvp-form.module.css"

type RsvpFormProps = {
  attendanceLegend: string
  guestNameLabel: string
  guestNamePlaceholder: string
  note: string
  options: readonly string[]
  submitLabel: string
  submittedLabel: string
}

export function RsvpForm({
  attendanceLegend,
  guestNameLabel,
  guestNamePlaceholder,
  note,
  options,
  submitLabel,
  submittedLabel,
}: RsvpFormProps) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className="sr-only">{guestNameLabel}</span>
        <input
          type="text"
          name="guest_name"
          placeholder={guestNamePlaceholder}
          required
        />
      </label>

      <p className={styles.note}>{note}</p>

      <fieldset className={styles.checkboxes}>
        <legend className="sr-only">{attendanceLegend}</legend>
        {options.map((option) => (
          <label key={option}>
            <input type="checkbox" name="attendance[]" value={option} />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      <button className={styles.submit} type="submit">
        {isSubmitted ? submittedLabel : submitLabel}
      </button>
    </form>
  )
}
