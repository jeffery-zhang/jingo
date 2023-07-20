import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PostDocument = Post & Document

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  summary: string

  @Prop({ default: '' })
  poster: string

  @Prop({ required: true })
  content: string

  @Prop(
    raw({
      _id: { type: String, required: true },
      username: { type: String, required: true },
      mail: { type: String, required: true },
      avatar: { type: String },
    }),
  )
  author: Record<string, string>

  @Prop(
    raw({
      _id: { type: String, required: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
    }),
  )
  subject: Record<string, string>

  @Prop(
    raw({
      _id: { type: String, required: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
    }),
  )
  category: Record<string, string>

  @Prop({ required: true, default: true })
  isPublic: boolean

  @Prop({ required: true, default: 0 })
  like: number

  @Prop({ required: true, default: 0 })
  pv: number

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)
