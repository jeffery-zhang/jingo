import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  public readonly name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(2)
  public readonly alias: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly sort: number

  @IsString()
  @IsNotEmpty()
  public readonly parentId: string
}
