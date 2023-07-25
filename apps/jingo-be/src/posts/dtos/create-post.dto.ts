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
  public readonly title: string

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public readonly summary: string

  @IsOptional()
  @IsString()
  public readonly poster: string

  @IsNotEmpty()
  @IsString()
  public readonly content: string

  @IsNotEmpty()
  @IsString()
  public readonly categoryId: string

  @IsNotEmpty()
  @IsBoolean()
  public readonly isPublic: boolean
}
