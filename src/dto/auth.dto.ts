import { IsNotEmpty,  IsInt, Length, IsString } from "class-validator"

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(1,20)
  username: string

  @IsString()
  @IsNotEmpty()
  @Length(1,20)
  password: string
}