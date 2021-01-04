import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Param,
} from '@nestjs/common';
import FileService from './file.service';
import { FileResource } from './file.resource';
import { AuthGuard } from '../auth/auth.guard';
import { S3 } from 'aws-sdk';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async store(@Body() body: CrateFileDTO): Promise<FileResource> {
    const file = await this.fileService.upsert({
      name: body.name,
      path: body.path,
      size: body.size,
    });

    return new FileResource(file);
  }

  @Delete(':uuid')
  async destroy(@Param('uuid') uuid: string): Promise<HttpStatus.NO_CONTENT> {
    return this.fileService.delete(uuid);
  }

  @Get()
  async index(): Promise<FileResource[]> {
    const files = await this.fileService.getAll();

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
