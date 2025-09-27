import type { Metadata } from 'next'
<<<<<<< HEAD
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
=======
import './globals.css'

export const metadata: Metadata = {
  title: 'MediScan- AI symptom Checker',
  description: 'Professional medical diagnosis assistant',
>>>>>>> upstream/main
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
=======
>>>>>>> upstream/main
      <body>{children}</body>
    </html>
  )
}
