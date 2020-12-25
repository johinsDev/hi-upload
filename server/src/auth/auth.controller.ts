import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(): Promise<User[]> {
    return this.authService.users();
  }
}
