import { HttpStatus, Injectable } from '@nestjs/common';
import { File } from './file.entity';
import { FileRepository } from './file.repository';
import S3Service from './s3.service';
import * as crypto from 'crypto';
import * as days from 'dayjs';
import { S3 } from 'aws-sdk';
import { AuthService } from '../auth/auth.service';
@Injectable()
export default class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly storage: S3Service,
    private readonly authService: AuthService,
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

  getAll(): Promise<File[]> {
    return this.fileRepository.find({
      order: {
        createdAt: 'DESC',
      },
      where: [
        {
          user: this.authService.user,
        },
      ],
    });
  }

  async delete(uuid: string): Promise<HttpStatus.NO_CONTENT> {
    await this.fileRepository.remove(
      await this.fileRepository.findOne({
        where: [
          {
            id: uuid,
            user: this.authService.user,
          },
        ],
      }),
    );

    return HttpStatus.NO_CONTENT;
  }

  async upsert(data: CrateFileDTO): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: [
        {
          user: this.authService.user,
          path: data.path,
        },
      ],
    });

    if (file) {
      file.name = data.name;
      file.size = data.size;

      return await this.fileRepository.save(file);
    }

    return await this.fileRepository
      .create({
        ...data,
        user: this.authService.user,
      })
      .save();
  }
}
