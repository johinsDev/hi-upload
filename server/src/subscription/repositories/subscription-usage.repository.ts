import { EntityRepository, Repository } from 'typeorm';
import { SubscriptionUsage } from '../entities/subscription-usage.entity';

@EntityRepository(SubscriptionUsage)
export class SubscriptionUsageRepository extends Repository<
  SubscriptionUsage
> {}
