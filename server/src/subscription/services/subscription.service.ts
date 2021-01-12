import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_REGISTER } from 'src/auth/auth.constants';
import { User } from 'src/auth/user.entity';
import { Subscription } from '../entities/subscription.entity';
import TimePeriodService from '../period.service';
import { PlanFeatureRepository } from '../plan-features.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionUsage } from '../entities/subscription-usage.entity';

@Injectable()
export default class SubscriptionService {
  private readonly period: typeof TimePeriodService;

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
    private readonly planFeaturesRepository: PlanFeatureRepository,
    private readonly authService: AuthService,
  ) {
    this.period = TimePeriodService;
  }

  async subscription(): Promise<Subscription> {
    return this.subscriptionRepository.subscription(this.authService.user);
  }

  async canUseFeature(featureSlug: string): Promise<boolean> {
    const subscription = await this.subscription();

    const feature = subscription.plan.features.find(s =>
      s.slug.includes(featureSlug),
    );

    const usage = subscription.usages.find(u =>
      u.feature.slug.includes(featureSlug),
    );

    if (feature?.value === 'true') {
      return true;
    }

    if (
      feature?.value === null ||
      feature?.value === '0' ||
      feature?.value === 'false' ||
      usage?.expired()
    ) {
      return false;
    }

    return Number(feature?.value ?? 0) - Number(usage?.used ?? 0) > 0;
  }

  async create(user: User): Promise<any> {
    const planFree = 'free';

    const plan = await this.planRepository.findOne({
      where: [
        {
          slug: planFree,
        },
      ],
    });

    const period = new this.period().init(
      plan.invoiceInterval,
      plan.invoicePeriod,
    );

    const trial = new this.period().init(plan.trialInterval, plan.trialPeriod);

    // return this.subscriptionRepository
    //   .create({
    //     name: 'default',
    //     plan,
    //     trialEndsAt: plan.hasTrial() ? trial.end : null,
    //     startsAt: period.start,
    //     endsAt: plan.isFree() ? null : period.end,
    //     user,
    //   })
    //   .save();
  }

  async recordFeatureUsage(
    featureSlug: string,
    uses?: number,
    incremental?: boolean,
  ) {
    const feature = await this.planFeaturesRepository.findBySlug(
      this.authService.user,
      featureSlug,
    );

    const usage = await SubscriptionUsage.createQueryBuilder('usages')
      .innerJoin('usages.subscription', 'subscription')
      .innerJoin('subscription.user', 'user')
      .where('subscription.name = :name', { name: 'default' })
      .orderBy('usages.created_at', 'ASC')
      .andWhere('usages.features_id = :featureId', {
        featureId: feature.id,
      })
      .andWhere('user.id = :userId', {
        userId: this.authService.user.id,
      })
      .getOne();
  }

  @OnEvent(EVENT_REGISTER, { async: true })
  async handleUserLoginEvent(user: User): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      relations: ['plan', 'plan.features', 'usages'],
      where: [
        {
          user,
        },
      ],
    });

    if (!subscription) {
      await this.create(user);
    }
  }
}
