import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CategoryDocument = Category & Document

@Schema()
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true, unique: true })
  alias: string

  @Prop({ required: true })
  sort: number

  @Prop(
    raw({
      _id: { type: String, required: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
    }),
  )
  parent: Record<string, string>

  @Prop({ required: true, default: () => new Date() })
  createTime: Date

  @Prop({ required: true, default: () => new Date() })
  updateTime: Date
}

export const CategorySchema = SchemaFactory.createForClass(Category)
