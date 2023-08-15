import { FC } from 'react'

import { Logo } from './logo'
import { Menu } from './menu'
import { ToggleTheme } from './toggleTheme'
import { User } from './user'

export const Header: FC = () => {
  return (
    <header className='bg-base-100'>
      <div className='navbar navbar-center container mx-auto justify-between'>
        <Logo />
        <Menu className='hidden md:block' />
        <div className='flex'>
          <ToggleTheme />
          <User />
        </div>
      </div>
    </header>
  )
}
