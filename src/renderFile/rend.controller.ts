import { Controller,Get,Render, Res,UseGuards, Dependencies, Param} from "@nestjs/common";
import { renderService } from "./rend.service";


@Controller('/')
@Dependencies(renderService)
export class renderController {
  constructor(public rendService:renderService){}
  @Get("")
  @Render('index.html')
   home(){}

  @Get("auth/login")
  @Render('login.html')
   log(){} 

  @Get("auth/signup")
  @Render('register.html')
   reg() {}
}