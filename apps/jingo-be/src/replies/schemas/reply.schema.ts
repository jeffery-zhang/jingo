import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ReplyDocument = Reply & Document

@Schema()
export class Reply extends Document {
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
      content: { type: String, required: true },
      type: { type: String, required: true },
    }),
  )
  replyTo: Record<string, string>

  @Prop({ required: true, default: [], type: [String] })
  likes: string[]

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const ReplySchema = SchemaFactory.createForClass(Reply)
