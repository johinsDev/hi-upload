import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { File } from './file.entity';
import { FileRepository } from './file.repository';

@Injectable()
export default class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

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
