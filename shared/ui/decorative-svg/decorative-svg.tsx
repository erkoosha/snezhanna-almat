type DecorativeSvgProps = {
  className?: string
}

export function Curve({ className }: DecorativeSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 363.4 61.9"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0.94 28.3C19.66-25.2 104.33 30 160.94 52.38 246.94 86.38 350 7.74 362.94 0.88" />
    </svg>
  )
}

export function Heart({ className }: DecorativeSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 39.1 36"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.01 1.06C14.14-3.45 18.95 7.48 20.09 13.51 23.02 7.51 30.56-3.06 37.28 2.61 44.01 8.28 28.89 28.39 18.34 35.86 12.15 30.32-8.65 6.7 4.01 1.06Z" />
    </svg>
  )
}
