import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { File } from './file.entity';
import { FileRepository } from './file.repository';
import S3Service, { SignedUrlResponse } from './s3.service';
import * as crypto from 'crypto';
import * as days from 'dayjs';
import { S3 } from 'aws-sdk';
@Injectable()
export default class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly storage: S3Service,
  ) {}

  signedFile(data: SignedDTO): Promise<S3.PresignedPost> {
    const fileName =
      crypto
        .createHash('md5')
        .update(data.name + days().millisecond())
        .digest('hex') +
      '.' +
      data.extension;

    return this.storage.getSignedUrl(`files/${fileName}`);
  }

  getAll(user: User): Promise<File[]> {
    return this.fileRepository.find({
      where: [
        {
          user,
        },
      ],
    });
  }

  find(): Promise<File> {
    return this.fileRepository.findOne({
      where: [
        {
          id: '01c840b3-f96e-475f-9b1a-bdc0e6fe6ede',
        },
      ],
    });
  }
}
