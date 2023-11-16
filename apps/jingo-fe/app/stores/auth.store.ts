import { create } from 'zustand'
import { encryptPassword } from '@jingo/utils/src/encrypt'

import { IUser, IRegisterParams } from '../types/users'
import { login, verify, register, changePwd } from '../service/auth'

interface IUserStore {
  isLogged: boolean
  user: null | IUser
  setUser: (user: Partial<IUser>) => void
  login: (
    username: string,
    password: string,
    onSuccess?: () => void,
    onFailed?: () => void,
  ) => Promise<void>
  verify: () => Promise<void>
  register: (
    dto: IRegisterParams,
    onSuccess?: () => void,
    onFailed?: () => void,
  ) => Promise<void>
  changePwd: (
    oldPwd: string,
    newPwd: string,
    onSuccess?: () => void,
    onFailed?: () => void,
  ) => Promise<void>
  logout: () => void
}

const removeTokenFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token')
    window.location.reload()
  }
}

export const useUserStore = create<IUserStore>((set, get) => ({
  isLogged: false,
  user: null,
  setUser(data) {
    const user = get().user
    set({
      user: {
        ...user!,
        ...data,
      },
    })
  },
  async login(username, password, onSuccess, onFailed) {
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
  async register(dto: IRegisterParams, onSuccess, onFailed) {
    const login = get().login
    const { data: user, success } = await register({
      ...dto,
      password: encryptPassword(dto.password),
    })
    if (success && user) {
      await login(user.username, dto.password, onSuccess, onFailed)
    } else {
      onFailed?.()
    }
  },
  async changePwd(oldPwd, newPwd, onSuccess, onFailed) {
    const { success } = await changePwd({
      oldPwd: encryptPassword(oldPwd),
      newPwd: encryptPassword(newPwd),
    })
    if (success) {
      onSuccess?.()
    } else {
      onFailed?.()
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
