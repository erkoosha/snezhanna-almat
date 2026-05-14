import { cn } from "@/lib/utils"

import styles from "./marquee.module.scss"

type MarqueeProps = {
  className?: string
  repeat?: number
  text: string
  variant?: "default" | "light"
}

export function Marquee({
  className,
  repeat = 6,
  text,
  variant = "default",
}: MarqueeProps) {
  return (
    <div
      className={cn(
        styles.marquee,
        variant === "light" && styles.light,
        className
      )}
      aria-hidden="true"
    >
      <div className={styles.track}>
        {Array.from({ length: repeat }, (_, index) => (
          <span className={styles.item} key={`${text}-${index}`}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
