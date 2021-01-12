import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import TimePeriodService from './period.service';
import { PlanController } from './controllers/plan.controller';
import { PlanRepository } from './repositories/plan.repository';
import { PlanFeatureRepository } from './plan-features.repository';
import PlanService from './services/plan.service';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionController } from './controllers/subscription.controller';
import SubscriptionService from './services/subscription.service';
import { SubscriptionUsageRepository } from './repositories/subscription-usage.repository';
import { PlanSubscriber } from './subscribers/plan.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanRepository,
      PlanFeatureRepository,
      SubscriptionRepository,
      SubscriptionUsageRepository,
    ]),
  ],
  controllers: [PlanController, SubscriptionController],
  providers: [
    PlanService,
    TimePeriodService,
    SubscriptionService,
    PlanSubscriber,
  ],
  exports: [
    PlanService,
    TimePeriodService,
    SubscriptionService,
    PlanSubscriber,
  ],
})
export class SubscriptionModule {}
