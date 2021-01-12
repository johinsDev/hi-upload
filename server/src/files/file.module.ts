import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'aws-sdk';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import FileService from './file.service';
import { FileSubscriber } from './file.subscriber';
import S3Service from './s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository]),
    ConfigModule,
    SubscriptionModule,
  ],
  controllers: [FileController],
  providers: [FileService, ConfigService, S3Service, FileSubscriber],
})
export class FileModule {}
