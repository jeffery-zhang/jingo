import { Exclude } from 'class-transformer'
import { Types } from 'mongoose'

export class UserEntity {
  _id: string
  username: string
  mail: string
  avatar: string
  roles: string[]
  token?: string

  @Exclude()
  password: string

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
    if (partial._id && Types.ObjectId.isValid(partial._id)) {
      this._id = partial._id.toString()
    }
  }
}
