'use client'

import { FC, useEffect } from 'react'
import { UserIcon } from '@jingo/icons'

import { useUserStore } from '@/app/stores/user.store'

export const User: FC = () => {
  const { isLogged, user, login, verify } = useUserStore((state) => ({
    ...state,
  }))

  useEffect(() => {
    if (verify) {
      verify()
    }
  }, [verify])

  return <div></div>
}
