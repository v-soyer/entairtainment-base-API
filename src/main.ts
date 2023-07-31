import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Bases API');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Set api with swagger only if enabled
  if (config.get('API_DOC') === 'TRUE') {
    logger.log('API Documentation is enabled');
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Documentation for entertainment base')
      .setDescription('Existing Endpoints')
      .setVersion('1.0')
      .addTag('List of existing modules')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(8000);
  logger.log(`service is running on: ${await app.getUrl()}`);
}
bootstrap();
