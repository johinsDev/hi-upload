import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<FastifyReply>();

    return response.status(400).send({
      statusCode: 400,
      errors: exception.getResponse(),
      message: exception.message,
    });
  }
}
