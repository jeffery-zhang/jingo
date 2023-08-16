import type { Metadata } from 'next'

import { Header } from './components/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jingo',
  description: 'Welcome to Jingo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='h-screen bg-base-200 text-base-content'>
        <Header></Header>
        {children}
      </body>
    </html>
  )
}
