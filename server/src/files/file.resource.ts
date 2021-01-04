import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';

export class FileResource {
  name: string;

  @Expose({ name: 'uuid' })
  id: string;

  @Exclude()
  size: number;

  @Exclude()
  user: User;

  @Exclude()
  path: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updateAt: Date;

  constructor(partial: Partial<FileResource>) {
    Object.assign(this, partial);
  }
}
