import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mutare Rangers Basketball Academy',
  description:
    'Mutare Rangers Basketball Academy — Where Iron Sharpens Iron. Developing champions, building leaders.',
  generator: 'v0.app',
  metadataBase: new URL('https://mutare-rangers.vercel.app'),
  openGraph: {
    title: 'Mutare Rangers Basketball Academy',
    description:
      'Mutare Rangers Basketball Academy — Where Iron Sharpens Iron. Developing champions, building leaders.',
    url: 'https://mutare-rangers.vercel.app',
    siteName: 'Mutare Rangers Basketball Academy',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mutare Rangers Basketball Academy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mutare Rangers Basketball Academy',
    description:
      'Mutare Rangers Basketball Academy — Where Iron Sharpens Iron. Developing champions, building leaders.',
    images: ['/images/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f1a12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}