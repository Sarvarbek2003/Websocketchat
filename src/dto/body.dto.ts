import { IsEmpty, IsInt, Length, IsString } from "class-validator"

export class BodyDto {
  @IsEmpty()
  @IsInt()
  from_user_id: number
  to_user_id: number

  @IsString()
  @Length(1,1000)
  message: string
}