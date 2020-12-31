import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RedisService } from 'src/cache/redis.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserResource } from './user.resource';

// token repository redis
//  emit envet user login, logout
// validate login
// class-transformer reponse user

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { id: number }): Promise<{ token: string }> {
    return this.authService.loginViaId(body.id);
  }

  @Post('sign-in')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<UserResource> {
    const user = await this.authService.attempt(body.email, body.password);

    return new UserResource(user);
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  async logout(): Promise<HttpStatus.OK> {
    await this.authService.logout();

    return HttpStatus.OK;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(): UserResource {
    return new UserResource(this.authService.user);
  }
}
