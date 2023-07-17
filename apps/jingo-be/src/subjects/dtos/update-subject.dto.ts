import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator'

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(1)
  public readonly name: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(2)
  public readonly alias: string

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly sort: number
}
