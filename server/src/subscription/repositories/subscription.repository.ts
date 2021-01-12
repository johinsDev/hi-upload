import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  async subscription(
    user: User,
    name?: string,
  ): Promise<Subscription | undefined> {
    return this.findOne({
      relations: ['plan', 'plan.features', 'usages', 'usages.feature'],
      where: [
        {
          user,
          name: name || 'default',
        },
      ],
    });
  }
}
