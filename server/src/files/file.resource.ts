import { Exclude, Expose } from 'class-transformer';

export class FileResource {
  name: string;

  @Expose({ name: 'uuid' })
  id: string;

  @Exclude()
  size: number;

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
