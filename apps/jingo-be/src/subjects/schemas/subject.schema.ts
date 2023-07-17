import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type SubjectDocument = Subject & Document

@Schema()
export class Subject extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  alias: string

  @Prop({ required: true })
  sort: string

  @Prop({ required: true, default: new Date() })
  createTime: Date

  @Prop({ required: true, default: new Date() })
  updateTime: Date
}

export const SubjectSchema = SchemaFactory.createForClass(Subject)
