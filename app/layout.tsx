import type { Metadata, Viewport } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "Свадьба !",
  description: "Свадебное приглашение Алмата и Снежанны",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Алмат + Снежанна",
    description: "17.06.2026",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
