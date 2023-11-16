export interface ILoginParams {
  username: string
  password: string
}

export interface IUser {
  _id: string
  username: string
  mail: string
  avatar: string
  roles: string[]
  token?: string
}

export interface IRegisterParams {
  username: string
  password: string
  mail: string
  avatar?: string
  roles: string[]
}

export interface IChangePwdParams {
  oldPwd: string
  newPwd: string
}

export interface IUpdateParams {
  username?: string
  mail?: string
  avatar?: string
}
