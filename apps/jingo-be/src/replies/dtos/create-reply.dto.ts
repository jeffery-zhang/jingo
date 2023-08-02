import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator'

import { ReplyType } from '../entities/reply-type.entity'

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public readonly content: string

  @IsNotEmpty()
  @IsString()
  public readonly fatherId: string

  @IsNotEmpty()
  @IsEnum(ReplyType)
  public readonly replyType: ReplyType
}
