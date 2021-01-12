import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(objectOrError?: string | any, description?: string) {
    super(objectOrError, description);
  }
}
