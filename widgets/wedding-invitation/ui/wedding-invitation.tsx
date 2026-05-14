import Image from "next/image"
import { Fragment } from "react"

import { weddingInvitation } from "@/entities/wedding/model/invitation"
import { RsvpForm } from "@/features/rsvp"
import { Curve, Heart } from "@/shared/ui/decorative-svg"
import { Marquee } from "@/shared/ui/marquee"

import styles from "./wedding-invitation.module.css"

type LinesProps = {
  lines: readonly string[]
}

function Lines({ lines }: LinesProps) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ))
}

export function WeddingInvitation() {
  const invitation = weddingInvitation

  return (
    <main className={styles.invite}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Curve className={`${styles.curve} ${styles.curveTop}`} />
        <Heart className={`${styles.heart} ${styles.heroHeartTop}`} />

        <p className={styles.heroLead}>{invitation.hero.lead}</p>
        <h1 className={styles.heroTitle} id="hero-title">
          {invitation.hero.title}
        </h1>

        <div className={styles.heroQuotes}>
          {invitation.hero.quotes.map((quote) => (
            <p key={quote}>{quote}</p>
          ))}
        </div>

        <Image
          className={styles.heroKids}
          src={invitation.hero.image.src}
          alt={invitation.hero.image.alt}
          width={invitation.hero.image.width}
          height={invitation.hero.image.height}
          priority
        />

        <Marquee text={invitation.hero.marquee} />
      </section>

      <section className={styles.dateSection} aria-labelledby="date-title">
        <Image
          className={`${styles.dateDecor} ${styles.dateDecorPhoto}`}
          src={invitation.date.decor.photo.src}
          alt=""
          aria-hidden="true"
          width={invitation.date.decor.photo.width}
          height={invitation.date.decor.photo.height}
        />
        <div className={styles.dateText}>
          <p>
            <Lines lines={invitation.date.intro} />
          </p>
          <h2 className={styles.dateTitle} id="date-title">
            {invitation.date.title}
          </h2>
        </div>

        <Image
          className={styles.calendar}
          src={invitation.date.calendar.src}
          alt={invitation.date.calendar.alt}
          width={invitation.date.calendar.width}
          height={invitation.date.calendar.height}
        />
        <Image
          className={`${styles.dateDecor} ${styles.dateDecorSave}`}
          src={invitation.date.decor.save.src}
          alt=""
          aria-hidden="true"
          width={invitation.date.decor.save.width}
          height={invitation.date.decor.save.height}
        />
      </section>

      <section
        className={styles.locationSection}
        aria-labelledby="location-title"
      >
        <h2 className={styles.sectionTitle} id="location-title">
          {invitation.location.title}
        </h2>

        <p className={styles.locationName}>{invitation.location.name}</p>
        <p className={styles.locationAddress}>
          <Lines lines={invitation.location.address} />
        </p>
        <a
          className={styles.mapButton}
          href={invitation.location.mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          {invitation.location.mapLabel}
        </a>
      </section>

      <section
        className={styles.gatheringSection}
        aria-labelledby="gathering-title"
      >
        <h2 className={styles.sectionTitle} id="gathering-title">
          {invitation.gathering.title}
        </h2>

        <div className={styles.gatheringCard}>
          <time dateTime={invitation.gathering.dateTime}>
            {invitation.gathering.time}
          </time>
          <p>{invitation.gathering.description}</p>
        </div>

        <Heart className={`${styles.heart} ${styles.gatheringHeart}`} />
      </section>

      <section className={styles.rsvpSection} aria-labelledby="rsvp-title">
        <h2 className="sr-only" id="rsvp-title">
          {invitation.rsvp.title}
        </h2>
        <p className={styles.rsvpIntro}>
          <Lines lines={invitation.rsvp.intro} />
        </p>

        <RsvpForm
          attendanceLegend={invitation.rsvp.attendanceLegend}
          guestNameLabel={invitation.rsvp.guestNameLabel}
          guestNamePlaceholder={invitation.rsvp.guestNamePlaceholder}
          note={invitation.rsvp.note}
          options={invitation.rsvp.options}
          submitLabel={invitation.rsvp.submitLabel}
          submittedLabel={invitation.rsvp.submittedLabel}
        />
      </section>

      <Marquee text={invitation.footer.marquee} variant="light" />

      <footer className={styles.footer}>
        <Curve className={`${styles.curve} ${styles.footerCurve}`} />
        <Heart className={`${styles.heart} ${styles.footerHeart}`} />
        <p className={styles.footerTitle}>{invitation.footer.title}</p>
        <p className={styles.footerNames}>{invitation.footer.names}</p>
      </footer>
    </main>
  )
}
