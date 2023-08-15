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
