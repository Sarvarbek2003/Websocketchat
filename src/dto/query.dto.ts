import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class QueryDto {
  @IsNotEmpty()
  @IsNumber()
  to_user_id:number
}