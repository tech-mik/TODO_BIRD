import type { Metadata } from 'next'
import { Bitter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const font = Bitter({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${font.className} w-screen h-screen antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
