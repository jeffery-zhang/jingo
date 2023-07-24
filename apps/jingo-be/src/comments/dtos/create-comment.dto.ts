import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateCommentsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  content: string

  @IsNotEmpty()
  @IsString()
  postId: string
}
