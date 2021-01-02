import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import FileService from './file.service';
import S3Service from './s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository]), ConfigModule],
  controllers: [FileController],
  providers: [FileService, ConfigService, S3Service],
})
export class FileModule {}
