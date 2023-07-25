import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateCommentsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public readonly content: string

  @IsNotEmpty()
  @IsString()
  public readonly postId: string
}
