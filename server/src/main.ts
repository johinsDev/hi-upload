import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { ValidationException } from './shared/validation.exception';
import { ValidationFilter } from './shared/validation.filter';

function covertErrorToObject(errors: ValidationError[]) {
  const result = {};

  for (const error of errors) {
    result[error.property] = Object.values(error.constraints)[0];
    if (Object.keys(error.children).length > 0) {
      result[error.property] = covertErrorToObject(error.children);
    }
  }

  return result;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.useGlobalFilters(new ValidationFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => {
        return new ValidationException(covertErrorToObject(errors));
      },
    }),
  );

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
