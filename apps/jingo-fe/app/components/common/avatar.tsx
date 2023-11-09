import { FC } from 'react'
import Image from 'next/image'

import { IUser } from '@/app/types/users'

interface IAvatarProps {
  user: IUser
  size?: 'sm' | 'md' | 'lg'
}

interface IPlaceholderProps {
  username: string
  size?: 'sm' | 'md' | 'lg'
}

const getTextSizeClassName = (size: IAvatarProps['size']) => {
  switch (size) {
    case 'sm':
      return 'text-base'
    case 'md':
      return 'text-xl'
    case 'lg':
      return 'text-3xl'
    default:
      return 'text-xl'
  }
}

const getSizeClassName = (size: IAvatarProps['size']) => {
  switch (size) {
    case 'sm':
      return 'w-6'
    case 'md':
      return 'w-8'
    case 'lg':
      return 'w-12'
    default:
      return 'text-xl'
  }
}

export const Avatar: FC<IAvatarProps> = ({ user, size = 'md' }) => {
  if (!user) return null

  return user.avatar ? (
    <div className='avatar'>
      <div className={`${getSizeClassName(size)}`}>
        <Image src={user.avatar} fill alt='avatar' className='rounded-full' />
      </div>
    </div>
  ) : (
    <AvatarPlaceholder
      username={(user.username || '').slice(0, 1).toUpperCase()}
      size={size}
    />
  )
}

export const AvatarPlaceholder: FC<IPlaceholderProps> = ({
  username,
  size = 'md',
}) => {
  return (
    <div className='avatar placeholder'>
      <div
        className={`bg-neutral text-neutral-content rounded-full ${getSizeClassName(
          size,
        )}`}
      >
        <span className={`whitespace-nowrap ${getTextSizeClassName(size)}`}>
          {username.slice(0, 1).toUpperCase()}
        </span>
      </div>
    </div>
  )
}
