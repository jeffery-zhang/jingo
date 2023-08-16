'use client'

import { FC, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@jingo/icons'

import { useGlobalStore, Theme } from '@/app/stores/global.store'

export const ToggleTheme: FC = () => {
  const { theme, setTheme } = useGlobalStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }))

  const initTheme = () => {
    const storedTheme = window.localStorage.getItem('theme') as typeof theme
    if (!storedTheme) setTheme(Theme.EMERALD)
    else setTheme(storedTheme)
  }

  const toggle = () => {
    setTheme(theme === Theme.EMERALD ? Theme.FOREST : Theme.EMERALD)
  }

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <div className='swap swap-rotate'>
      <input type='checkbox' />
      <SunIcon
        className={`${
          theme === Theme.EMERALD ? 'swap-off' : 'swap-on'
        } w-6 h-6`}
        onClick={toggle}
      />
      <MoonIcon
        className={`${theme === Theme.FOREST ? 'swap-off' : 'swap-on'} w-6 h-6`}
        onClick={toggle}
      />
    </div>
  )
}
