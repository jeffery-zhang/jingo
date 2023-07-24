import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  summary: string

  @IsOptional()
  @IsString()
  poster: string

  @IsOptional()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  categoryId: string

  @IsOptional()
  @IsBoolean()
  isPublic: boolean
}
