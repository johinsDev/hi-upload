import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import FileService from './file.service';
import { FileResource } from './file.resource';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { S3 } from 'aws-sdk';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async index(): Promise<FileResource[]> {
    const files = await this.fileService.getAll(this.authService.user);

    return files.map(file => new FileResource(file));
  }

  @Post('signed')
  async signed(@Body() body: SignedDTO): Promise<S3.PresignedPost> {
    return this.fileService.signedFile({
      extension: body.extension,
      name: body.name,
    });
  }
}
