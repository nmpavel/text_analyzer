import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionFilter } from './utils/exception.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
 
const app = await NestFactory.create(AppModule,{
  bufferLogs: true,
});
app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionFilter());
  app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();
