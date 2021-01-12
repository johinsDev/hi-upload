import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class FileResource {
  @Expose()
  name: string;

  @Expose({ name: 'uuid' })
  id: string;

  @Expose()
  size: number;

  @Expose()
  path: string;

  constructor(partial: Partial<FileResource>) {
    Object.assign(this, partial);
  }
}
