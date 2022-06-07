import { Get, Inject, Req, Body, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Controller } from '@nestjs/common';
import { Request } from 'express';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { QueryDto,BodyDto } from './dto/index';

@Controller('')
export class AppController {
    constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('mychat') 
    async getMyUser(@Req() req: Request, @Body() dto: QueryDto ):Promise<any[]>{
       try {
         const userId =  req?.user['sub']
         const data = await this.pg.query(`select * from mychat($1,$2)`,[userId, dto.to_user_id])
         return data;
        } catch (error) {
           return error 
       }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('users')
    async getUsers():Promise<[{user_id, username, online}]>{
      try {
        const data = await this.pg.query(`select user_id, username, online from users`)
        return data;
       } catch (error) {
          return error 
      }
    }
}
