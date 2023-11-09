import {
  IsString,
  IsNotEmpty,
  NotContains,
  MinLength,
  MaxLength,
} from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(2)
  @NotContains('@')
  public readonly username: string

  @IsString()
  @IsNotEmpty()
  public readonly password: string
}
