import { Exclude, Expose, Transform } from 'class-transformer';
import { SubscriptionResource } from 'src/subscription/resources/subscription.resource';

@Exclude()
export class UserResource {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  token: string;

  @Expose()
  subscription: SubscriptionResource;

  @Expose({ name: 'emailVerified' })
  @Transform(value => !!value, { toClassOnly: true })
  emailVerifiedAt: Date | null;

  constructor(partial: Partial<UserResource>) {
    Object.assign(this, partial);
  }
}
