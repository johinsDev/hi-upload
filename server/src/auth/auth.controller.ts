import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ token: string }> {
    const token = await this.authService.attempt(body.email, body.password);
    console.log(this.authService.user, this.authService.isAuthenticated);

    return token;
  }
}
