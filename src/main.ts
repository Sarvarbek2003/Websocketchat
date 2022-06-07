import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { renderFile } from 'ejs'
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()
  app.engine('html', renderFile)
  app.setBaseViewsDir(join(__dirname, '../public'))
  app.useStaticAssets(join(__dirname, '../public'), {
    index: false,
    redirect: false
  })
  app.useStaticAssets(join(__dirname, '../file'), {
    index: false,
    redirect: false
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(7777);
}
bootstrap();
