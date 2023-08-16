import { fetcher } from './fetcher'
import { TResponse } from '../types/common'
import { ILoginParams, IUser } from '../types/users'

const paths = {
  login: '/auth/login',
  verify: '/auth/verify',
}

export const login = async (data: ILoginParams): Promise<TResponse<IUser>> =>
  fetcher.post(paths.login, {
    data,
  })

export const verify = async (): Promise<TResponse<IUser | null>> =>
  fetcher.get(paths.verify)
