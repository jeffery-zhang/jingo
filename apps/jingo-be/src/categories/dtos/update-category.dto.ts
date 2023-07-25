import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator'

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  public readonly id: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @MinLength(1)
  public readonly name: string

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(2)
  public readonly alias: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  public readonly sort: number

  @IsOptional()
  @IsString()
  public readonly parentId: string
}
