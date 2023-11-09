'use client'

import { FC, useEffect } from 'react'
import { UserIcon } from '@jingo/icons'

import { useUserStore } from '@/app/stores/user.store'
import { Avatar } from '../common/avatar'

export const User: FC = () => {
  const { isLogged, user, logout, verify } = useUserStore((state) => ({
    ...state,
  }))

  useEffect(() => {
    if (verify && window.localStorage.getItem('token')) {
      verify()
    }
  }, [verify])

  return (
    <div
      className='rounded-full cursor-pointer hover:bg-base-200 ml-4 p-2 \
      transition-colors duration-300 ease-in-out'
    >
      {isLogged ? (
        <div className='flex items-center dropdown dropdown-end dropdown-bottom'>
          <label
            key='label'
            tabIndex={0}
            className='flex items-center cursor-pointer'
          >
            <span className='text-sm pr-1 whitespace-nowrap'>
              {user?.username}
            </span>
            <Avatar user={user!} />
          </label>
          <ul
            key='list'
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <a>个人信息</a>
            </li>
            <li>
              <a onClick={logout}>退出登录</a>
            </li>
          </ul>
        </div>
      ) : (
        <div
          className='flex items-center'
          onClick={() => (window as any)['login-form']?.showModal()}
        >
          <span className='text-sm pr-1 whitespace-nowrap'>请登录</span>
          <UserIcon className='w-6 h-6' />
        </div>
      )}
    </div>
  )
}
