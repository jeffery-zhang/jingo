import { fetcher } from './fetcher'
import { TResponse } from '../types/common'
import {
  IChangePwdParams,
  ILoginParams,
  IRegisterParams,
  IUser,
} from '../types/users'

const paths = {
  login: '/auth/login',
  verify: '/auth/verify',
  register: '/auth/register',
  changePwd: '/auth/changePwd',
}

export const login = async (data: ILoginParams): Promise<TResponse<IUser>> =>
  fetcher.post(paths.login, data)

export const verify = async (): Promise<TResponse<IUser | null>> =>
  fetcher.get(paths.verify)

export const register = async (
  data: IRegisterParams,
): Promise<TResponse<IUser>> => fetcher.post(paths.register, data)

export const changePwd = async (data: IChangePwdParams): Promise<TResponse> =>
  fetcher.put(paths.changePwd, data)
