import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { ConfigModule } from '@nestjs/config';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import { renderController } from './renderFile/rend.controller';
import { renderService } from './renderFile/rend.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    NestPgpromiseModule.register({
      connection: {
          host: 'localhost',
          port: 5432,
          database: 'websocket',
          user: 'postgres',
          password: '2003',
      },
  }),
    AuthModule
  ],
  controllers: [renderController,AppController],
  providers: [renderService,AppGateway],
})
export class AppModule {}
