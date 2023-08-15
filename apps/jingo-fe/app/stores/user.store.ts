import { create } from 'zustand'

import { IUser } from '../types/users'
import { login, verify } from '../service/users'

export enum Theme {
  'EMERALD' = 'emerald',
  'FOREST' = 'forest',
}

interface IUserStore {
  isLogged: boolean
  user: null | IUser
  login: (username: string, password: string) => void
  verify: () => void
}

export const useUserStore = create<IUserStore>((set, get) => ({
  isLogged: false,
  user: null,
  async login(username, password) {
    const { data: user, success } = await login({ username, password })
    if (success) {
      set({ user, isLogged: true })
    }
  },
  async verify() {
    const { data: user, success } = await verify()
    if (success) {
      set({ user, isLogged: true })
    }
  },
}))
