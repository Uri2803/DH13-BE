import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { expression } from 'joi';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: 
        process.env.NODE_ENV === 'dev'
          ? ['https://localhost:5173', 'https://192.168.1.12:5173', 'https://192.168.1.14:5173']
          : 'https://your-production-domain.com'
    },
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('ĐH-HSV 13 API')
    .setDescription('The API for HCMUS ĐH-HSV 13 platform')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
