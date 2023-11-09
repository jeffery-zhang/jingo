import { FC } from 'react'

import { Logo } from './logo'
import { Menu } from './menu'
import { Search } from './search'
import { ToggleTheme } from './toggleTheme'
import { User } from './user'
import { DrawerMenu } from './drawerMenu'

export const Header: FC = () => {
  return (
    <header className='bg-base-100'>
      <div className='navbar navbar-center container mx-auto justify-between'>
        <Logo />
        <Menu className='hidden md:block' />
        <div className='flex'>
          <Search />
          <ToggleTheme />
          <User />
          <DrawerMenu />
        </div>
      </div>
    </header>
  )
}
