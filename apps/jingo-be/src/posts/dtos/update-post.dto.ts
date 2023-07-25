import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator'

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  public readonly id: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  public readonly title: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public readonly summary: string

  @IsOptional()
  @IsString()
  public readonly poster: string

  @IsOptional()
  @IsString()
  public readonly content: string

  @IsOptional()
  @IsString()
  public readonly categoryId: string

  @IsOptional()
  @IsBoolean()
  public readonly isPublic: boolean
}
