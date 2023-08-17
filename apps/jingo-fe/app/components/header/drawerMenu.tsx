import { FC } from 'react'
import { OtherIcon, CloseIcon } from '@jingo/icons'

import { Menu } from './menu'

export const DrawerMenu: FC = () => {
  return (
    <div className='drawer drawer-end ml-4 md:hidden'>
      <input type='checkbox' id='drawer-menu' className='drawer-toggle' />
      <div className='drawer-content'>
        <label htmlFor='drawer-menu'>
          <OtherIcon className='w-8 h-8' />
        </label>
      </div>
      <div className='drawer-side'>
        <label htmlFor='drawer-menu' className='drawer-overlay'></label>
        <div className='bg-base-100 w-80 h-full'>
          <div className='navbar navbar-end w-full'>
            <label htmlFor='drawer-menu'>
              <CloseIcon className='w-8 h-8' />
            </label>
          </div>
          <Menu />
        </div>
      </div>
    </div>
  )
}
