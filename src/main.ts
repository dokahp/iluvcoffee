import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getBotToken } from 'nestjs-telegraf';
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
        enableImplicitConversion: true, // проводит тип ?query сразу к dto
      },
    }),
  );
  const telegrammBot = app.get(getBotToken())
  app.use(telegrammBot.webhookCallback('/secret-path'));
  const config = new DocumentBuilder()
    .setTitle('IluvCoffee API documentation')
    .setDescription('The coffee endpoints')
    .setVersion('1.0')
    .addTag('Coffee')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
