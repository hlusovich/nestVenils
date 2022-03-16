import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { HttpExceptionFilter } from './exceptionfilters/exceptionFilter';

export async function bootstrap(): Promise<INestApplication> {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get('PORT') | 5000;
  config.update({
    accessKeyId: configService.get('ACCESS_KEY_ID'),
    secretAccessKey: configService.get('SECRET_ACCESS_KEY'),
    region: configService.get('REGION'),
  });
  await app.listen(port);
  console.log('started on port ' + port);
  return app;
}
bootstrap();
