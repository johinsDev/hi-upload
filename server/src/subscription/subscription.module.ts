import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import TimePeriodService from './period.service';
import { PlanController } from './plan.controller';
import { PlanRepository } from './plan.repository';
import { PlanFeatureRepository } from './plan-features.repository';
import PlanService from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanRepository, PlanFeatureRepository])],
  controllers: [PlanController],
  providers: [PlanService, TimePeriodService],
})
export class SubscriptionModule {}
