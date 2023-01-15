import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// whitelist: true - удаляет из запроса все свойства, которые не соответствуют dto
// forbidNonWhitelisted - дает bad request error, если endpoint получает свойство, которое не ожидает

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true // проводит тип ?query сразу к dto
      }
    }),
  );
  await app.listen(3000);
}
bootstrap();
