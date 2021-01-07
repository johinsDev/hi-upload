import { Injectable } from '@nestjs/common';

import { PlanRepository } from './plan.repository';
import { Plan } from './entities/plan.entity';
import { PlanFeatures } from './entities/plan-features.entity';
import { PlanFeatureRepository } from './plan-features.repository';
import TimePeriodService from './period.service';

@Injectable()
export default class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly planFeatureRepository: PlanFeatureRepository,
    private readonly periodService: TimePeriodService,
  ) {}

  async find(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: [
        {
          id,
        },
      ],
    });

    console.log('HAS TRIAL', plan.hasTrial());
    console.log('IS FREE', plan.isFree());
    console.log('HAS GRACE', plan.hasGrace());

    return plan;
  }

  async getAll(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async create(): Promise<Plan> {
    const plan = await this.planRepository
      .create({
        name: 'Pro',
        description: 'Pro plan',
        price: 9.99,
        signupFee: 1.99,
        invoicePeriod: 1,
        invoiceInterval: 'month',
        trialPeriod: 15,
        trialInterval: 'day',
        sortOrder: 1,
        currency: 'USD',
        slug: 'pro',
      })
      .save();

    const planFeature = new PlanFeatures();

    planFeature.name = 'Storage';
    planFeature.description = 'Storage size files';
    planFeature.value = '5000000';
    planFeature.sortOrder = 1;
    planFeature.plans = [plan];
    planFeature.slug = 'storage';

    await planFeature.save();

    return plan;
  }
}
