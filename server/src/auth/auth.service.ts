import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  users(): Promise<User[]> {
    return User.find();
  }
}
