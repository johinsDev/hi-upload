import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface IHashService {
  hash(data: string): Promise<string>;
  verify(data: any, encrypted: string): Promise<boolean>;
}

const saltOrRounds = 10;

@Injectable()
export class HashService implements IHashService {
  hash(data: string): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  verify(data: any, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
