import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import TimePeriodService from './period.service';
import { PlanController } from './plan.controller';
import { PlanRepository } from './plan.repository';
import { PlanFeatureRepository } from './plan-features.repository';
import PlanService from './plan.service';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SubscriptionController } from './controllers/subscription.controller';
import SubscriptionService from './services/subscription.service';
import { SubscriptionUsageRepository } from './repositories/subscription-usage.repository';
import { AuthModule } from 'src/auth/auth.module';

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
  providers: [PlanService, TimePeriodService, SubscriptionService],
})
export class SubscriptionModule {}
