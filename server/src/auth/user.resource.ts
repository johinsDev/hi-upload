import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResource {
  id: number;
  email: string;
  name: string;
  token: string;

  @Expose({ name: 'emailVerified' })
  @Transform(value => !!value, { toClassOnly: true })
  emailVerifiedAt: Date | null;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updateAt: Date;

  constructor(partial: Partial<UserResource>) {
    Object.assign(this, partial);
  }
}
