import { Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsObject,
  ValidateNested,
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

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CategoryParentDto)
  public readonly parent: CategoryParentDto
}

export class CategoryParentDto {
  @IsString()
  @IsNotEmpty()
  public readonly _id: string

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
}
