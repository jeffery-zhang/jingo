import { IsString, IsNotEmpty } from 'class-validator'

export class ChangePwdDto {
  @IsString()
  @IsNotEmpty()
  public readonly oldPwd: string

  @IsString()
  @IsNotEmpty()
  public readonly newPwd: string
}
