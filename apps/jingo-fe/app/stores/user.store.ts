import { create } from 'zustand'
import { encryptPassword } from '@jingo/utils/src/encrypt'

import { IUser } from '../types/users'
import { login, verify } from '../service/users'

interface IUserStore {
  isLogged: boolean
  user: null | IUser
  login: (
    username: string,
    password: string,
    onSuccess?: () => void,
    onFailed?: () => void,
  ) => Promise<void>
  verify: () => Promise<void>
  logout: () => void
}

const removeTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token')
    window.location.reload()
  }
}

export const useUserStore = create<IUserStore>((set) => ({
  isLogged: false,
  user: null,
  async login(username, password, onSuccess, onFailed) {
    console.log(encryptPassword(password))
    const { data: user, success } = await login({
      username,
      password: encryptPassword(password),
    })
    if (success) {
      set({ user, isLogged: true })
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', user.token!)
      }
      onSuccess?.()
    } else {
      onFailed?.()
    }
  },
  async verify() {
    const { data: user, success } = await verify()
    if (success && user) {
      set({ user, isLogged: true })
    }
  },
  logout() {
    set({
      isLogged: false,
      user: null,
    })
    removeTokenFromLocalStorage()
  },
}))
