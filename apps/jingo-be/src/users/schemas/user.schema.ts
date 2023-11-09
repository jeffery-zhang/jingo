import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { encryptPasswordForDb } from '@jingo/utils'

import { Role } from '../../roles/role.enum'

export type UserDocument = User & Document

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true, unique: true })
  mail: string

  @Prop()
  avatar: string

  @Prop()
  roles: Role[]

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<User>('save', async function (next) {
  this.password = encryptPasswordForDb(this.password)
  next()
})
