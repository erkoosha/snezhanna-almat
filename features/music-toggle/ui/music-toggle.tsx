"use client"

import { RiMusicAiFill, RiPauseFill } from "@remixicon/react"
import * as React from "react"

import styles from "./music-toggle.module.css"

type MusicToggleProps = {
  className?: string
  src: string
}

export function MusicToggle({ className, src }: MusicToggleProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  async function handleToggle() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  function handleEnded() {
    setIsPlaying(false)
  }

  return (
    <>
      <button
        className={className ? `${styles.button} ${className}` : styles.button}
        type="button"
        aria-label={isPlaying ? "Поставить музыку на паузу" : "Включить музыку"}
        aria-pressed={isPlaying}
        onClick={handleToggle}
      >
        {isPlaying ? <RiPauseFill aria-hidden /> : <RiMusicAiFill aria-hidden />}
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        onEnded={handleEnded}
      />
    </>
  )
}
