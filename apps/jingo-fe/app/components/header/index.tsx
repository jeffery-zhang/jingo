import { FC } from 'react'

import { Logo } from './logo'
import { Menu } from './menu'

export const Header: FC = () => {
  return (
    <header className='bg-base-100'>
      <div className='navbar navbar-center container mx-auto justify-between'>
        <Logo />
        <Menu />
      </div>
    </header>
  )
}
