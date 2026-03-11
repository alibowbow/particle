import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/site-header'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/utils/site'

import './globals.css'

const geistSans = localFont({
  src: '../public/fonts/geist-sans.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = localFont({
  src: '../public/fonts/geist-mono.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="relative overflow-x-hidden">
          <SiteHeader />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}

