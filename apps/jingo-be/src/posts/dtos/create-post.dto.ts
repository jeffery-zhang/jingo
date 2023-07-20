import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  summary: string

  @IsOptional()
  @IsString()
  poster: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean
}
