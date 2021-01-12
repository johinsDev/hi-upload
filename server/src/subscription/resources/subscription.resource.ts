import { Exclude, Expose, Type } from 'class-transformer';
import { Plan } from '../entities/plan.entity';
import { PlanResource } from './plan.resource';
import { UsageResource } from './usage.resource';

@Exclude()
export class SubscriptionResource {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  startsAt: Date;

  @Expose()
  @Type(() => PlanResource)
  plan: Plan;

  @Expose()
  @Type(() => UsageResource)
  usages: UsageResource[];

  constructor(partial: Partial<SubscriptionResource>) {
    Object.assign(this, partial);
  }
}
