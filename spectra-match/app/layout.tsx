import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpectraMatch | Discover Your MBTI Compatibility',
  description: 'Deep personality analysis and compatibility matching powered by AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-glow" />
        <Navbar />
        <main className="min-h-[calc(100vh-64px)] relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
