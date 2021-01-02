import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import FileService from './file.service';
import S3Service from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository])],
  controllers: [FileController],
  providers: [FileService, S3Service],
})
export class FileModule {}
