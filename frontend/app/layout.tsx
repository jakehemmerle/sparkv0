import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spark - Conversation Transcription',
  description: 'Personal audio transcription with AI-powered Q&A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
