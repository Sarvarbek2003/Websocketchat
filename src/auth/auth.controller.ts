import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthDto } from "src/dto/auth.dto";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('signup')
    async signup(@Body() dto: AuthDto){
        return await this.authService.signup(dto)
    }
    @Post('login')
    async login(@Body() dto: AuthDto){
        return await this.authService.login(dto)
    }
}
