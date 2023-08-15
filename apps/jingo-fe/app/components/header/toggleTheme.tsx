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
    if (!storedTheme) setTheme(theme)
    else setTheme(storedTheme)
  }

  const toggle = () => {
    setTheme(theme === Theme.EMERALD ? Theme.FOREST : Theme.EMERALD)
  }

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <div className='cursor-pointer'>
      {theme === Theme.EMERALD ? (
        <SunIcon className='w-6 h-6' onClick={toggle} />
      ) : (
        <MoonIcon className='w-6 h-6' onClick={toggle} />
      )}
    </div>
  )
}
