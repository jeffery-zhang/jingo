'use client'

import { FC, useEffect } from 'react'
import Image from 'next/image'
import { UserIcon } from '@jingo/icons'

import { useUserStore } from '@/app/stores/user.store'

export const User: FC = () => {
  const { isLogged, user, logout, verify } = useUserStore((state) => ({
    ...state,
  }))

  useEffect(() => {
    if (verify) {
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
            <span className='text-sm pr-1'>{user?.username}</span>
            {user?.avatar ? (
              <div className='avatar'>
                <div className='w-8'>
                  <Image
                    src={user.avatar}
                    fill
                    alt='avatar'
                    className='rounded-full'
                  />
                </div>
              </div>
            ) : (
              <div className='avatar placeholder'>
                <div className='bg-neutral text-neutral-content rounded-full w-8'>
                  <span className='text-xl'>
                    {user?.username.slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
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
        <div className='flex items-center'>
          <span className='text-sm pr-1'>请登录</span>
          <UserIcon className='w-6 h-6' />
        </div>
      )}
    </div>
  )
}
