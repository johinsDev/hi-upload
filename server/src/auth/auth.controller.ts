import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<void> {
    await this.authService.attempt(body.email, body.password);

    this.authService.authenticate();
    return;
  }
}
