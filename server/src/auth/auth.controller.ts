import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserResource } from './user.resource';

// token repository redis
// validate login

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUser): Promise<UserResource> {
    const user = await this.authService.create({
      email: body.email,
      name: body.name,
      password: body.password,
    });

    return new UserResource(user);
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
