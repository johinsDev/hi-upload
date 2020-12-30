import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './user.entity';

// token repository redis
//  emit envet user login, logout
// validate login
// class-transformer reponse user

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in-via-id')
  async loginViaId(@Body() body: { id: number }): Promise<{ token: string }> {
    return this.authService.loginViaId(body.id);
  }

  @Post('register')
  async register(@Body() body: { id: number }): Promise<{ token: string }> {
    return this.authService.loginViaId(body.id);
  }

  @Post('sign-in')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ token: string }> {
    return this.authService.attempt(body.email, body.password);
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  async logout(): Promise<HttpStatus.OK> {
    await this.authService.logout();

    return HttpStatus.OK;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(): User {
    return this.authService.user;
  }
}
