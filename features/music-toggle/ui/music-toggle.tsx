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
  const hasUserPausedRef = React.useRef(false)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const playAudio = React.useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current

    if (!audio) {
      return false
    }

    try {
      await audio.play()
      setIsPlaying(true)
      return true
    } catch {
      setIsPlaying(false)
      return false
    }
  }, [])

  React.useEffect(() => {
    let isActive = true

    function removeInteractionListeners() {
      document.removeEventListener("pointerdown", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    async function startAfterInteraction() {
      if (!isActive || hasUserPausedRef.current) {
        return
      }

      const didStart = await playAudio()

      if (didStart) {
        removeInteractionListeners()
      }
    }

    function handleFirstInteraction() {
      void startAfterInteraction()
    }

    async function startImmediately() {
      const didStart = await playAudio()

      if (!didStart && isActive) {
        document.addEventListener("pointerdown", handleFirstInteraction)
        document.addEventListener("touchstart", handleFirstInteraction, {
          passive: true,
        })
        document.addEventListener("keydown", handleFirstInteraction)
      }
    }

    void startImmediately()

    return () => {
      isActive = false
      removeInteractionListeners()
    }
  }, [playAudio])

  async function handleToggle() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isPlaying) {
      hasUserPausedRef.current = true
      audio.pause()
      setIsPlaying(false)
      return
    }

    hasUserPausedRef.current = false
    await playAudio()
  }

  function handleEnded() {
    setIsPlaying(false)
  }

  return (
    <span className={className ? `${styles.root} ${className}` : styles.root}>
      <span className={styles.hint}>нажми на меня</span>
      <button
        className={styles.button}
        type="button"
        aria-label={isPlaying ? "Поставить музыку на паузу" : "Включить музыку"}
        aria-pressed={isPlaying}
        onClick={handleToggle}
      >
        {isPlaying ? (
          <RiPauseFill aria-hidden />
        ) : (
          <RiMusicAiFill aria-hidden />
        )}
      </button>
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        preload="auto"
        loop
        onEnded={handleEnded}
      />
    </span>
  )
}
