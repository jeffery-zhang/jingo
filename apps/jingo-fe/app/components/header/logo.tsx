import { FC } from 'react'
import Link from 'next/link'
/* eslint-disable-next-line */
import { Great_Vibes } from 'next/font/google'

interface IProps {
  size?: 'sm' | 'md' | 'lg'
  navigatable?: boolean
}

/* eslint-disable-next-line */
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
})

export const Logo: FC<IProps> = ({ size = 'lg', navigatable = true }) => {
  const getSizeClassName = () => {
    switch (size) {
      case 'sm':
        return 'text-2xl'
      case 'md':
        return 'text-3xl'
      case 'lg':
        return 'text-4xl'
      default:
        return 'text-2xl'
    }
  }

  if (!navigatable)
    return (
      <div
        className={`cursor-default text-primary ${getSizeClassName()} ${
          greatVibes.className
        }`}
      >
        Jingo
      </div>
    )

  return (
    <Link
      href='/'
      className={`text-primary ${getSizeClassName()} ${greatVibes.className}`}
    >
      Jingo
    </Link>
  )
}
