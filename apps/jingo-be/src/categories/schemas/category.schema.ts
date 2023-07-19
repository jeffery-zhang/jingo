import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CategoryDocument = Category & Document

@Schema()
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  alias: string

  @Prop({ required: true })
  sort: string

  @Prop({ required: true })
  parent: object

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)
