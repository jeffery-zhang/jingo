import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator'

export class UpdateCommentsDto {
  @IsNotEmpty()
  @IsString()
  public readonly id: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public readonly content: string
}
