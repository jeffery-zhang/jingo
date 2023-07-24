import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CommentDocument = Comment & Document

@Schema()
export class Comment extends Document {
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

  @Prop({ required: true })
  postId: string

  @Prop({ required: true, default: 0 })
  like: number

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
