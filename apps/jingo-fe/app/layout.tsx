import Script from 'next/script'
import type { Metadata } from 'next'

import { Header } from './components/header'
import { LoginForm } from './components/forms/loginForm'
import { RegisterForm } from './components/forms/registerForm'
import { ChangePwdForm } from './components/forms/changePwd'
import { PersonalForm } from './components/forms/personalForm'
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
        <LoginForm />
        <RegisterForm />
        <ChangePwdForm />
        <PersonalForm />
        {children}
        <Script src='https://at.alicdn.com/t/c/font_4211111_01me12v5ra0f.js' />
      </body>
    </html>
  )
}
