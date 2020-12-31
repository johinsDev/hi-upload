import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import FileService from './file.service';
import { FileResource } from './file.resource';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async index(): Promise<FileResource[]> {
    const files = await this.fileService.getAll(this.authService.user);

    return files.map(file => new FileResource(file));
  }
}
