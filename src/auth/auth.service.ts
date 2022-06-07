import { Injectable, Inject,ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from "@nestjs/config";
import { AuthDto } from 'src/dto/auth.dto';
import * as argon from "argon2";
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

@Injectable()
export class AuthService {
    constructor(
        @Inject(NEST_PGPROMISE_CONNECTION) private pg: IDatabase<any>,
        private jwt: JwtService,
        private config: ConfigService,
    ){}

    async signup(dto: AuthDto):Promise<any>{
        try {
            const  hash = await argon.hash(dto.password)

            const user = await this.pg.query('insert into users (username, password ) values ($1, $2) returning *',[dto.username, hash])
            
            return await this.signToken(user[0].user_id, user[0].username)
        } catch (error) {
            return error
        }
    }

    async login(dto: AuthDto):Promise<any>{
        try {
            const user = await this.pg.query('select * from users where username = $1 and password = $2',[dto.username, dto.password])
            if(!user) throw new ForbiddenException("User not found");

            const password = await argon.verify(user.password, dto.password);

            if(!password) throw new UnauthorizedException("Wrong password");

            return await this.signToken(user[0].user_id, user[0].username)
       } catch (error) {
            return error
       }
    }

    async signToken (userId: number, username: string): Promise<{ access_token: string, id: number }> {
        const payload = {
            sub: userId,
            username
        }

        const secret = this.config.get('SECRET_KEY')

        const token = await this.jwt.signAsync(payload,{
            expiresIn: '15h',
            secret: secret
        })

        return { 
            id: userId,
            access_token: token,
        }
    }
}
