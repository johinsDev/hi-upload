import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_REGISTER } from 'src/auth/auth.constants';
import { User } from 'src/auth/user.entity';
import { Subscription } from '../entities/subscription.entity';
import TimePeriodService from '../period.service';
import { PlanFeatureRepository } from '../plan-features.repository';
import { PlanRepository } from '../plan.repository';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionUsageRepository } from '../repositories/subscription-usage.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionUsage } from '../entities/subscription-usage.entity';

// payments and charges calc
// resume and stop
// Cupones
// endpoint para traer plans agrupados por interval
// movimientos,y logs de la supcription , plan and plan feature en la mitad el value
// function set net period
// emit log, create, swap, stop, resume, renew
// log suscriptio usage

// CRUD plan, mejorar creacion y edicion, metodo de sortOrder
// CRUD PLan features
// guards supscripton and supscription usage
@Injectable()
export default class SubscriptionService {
  private readonly period: typeof TimePeriodService;

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionUsageRepository: SubscriptionUsageRepository,
    private readonly planFeaturesRepository: PlanFeatureRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.period = TimePeriodService;
  }

  async swap(user: User, name?: string): Promise<any> {
    // 144a92bf-3191-4c73-a0e1-c9d3cb276236

    const planPro = 'pro';

    const planFree = 'free';

    const plan = await this.planRepository.findOne({
      relations: ['features'],
      where: [
        {
          slug: planPro,
        },
      ],
    });

    const subscription = await this.subscriptionRepository.findOne({
      relations: ['plan'],
      where: [
        {
          user,
          name: name || 'default',
        },
      ],
    });

    if (
      subscription.plan.invoicePeriod !== plan.invoicePeriod ||
      subscription.plan.invoiceInterval !== plan.invoiceInterval
    ) {
      const period = new this.period().init(
        plan.invoiceInterval,
        plan.invoicePeriod,
      );

      subscription.startsAt = period.start.toDate();
      subscription.endsAt = plan.isFree() ? null : period.end.toDate();

      // function remove usages
      await this.subscriptionUsageRepository.remove(
        await this.subscriptionUsageRepository.find({
          select: ['id'],
          where: [
            {
              subscription,
            },
          ],
        }),
      );
    }

    subscription.plan = plan;

    await subscription.save();

    return subscription;
  }

  async create(user: User): Promise<Subscription> {
    const planPro = 'pro';

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

    return this.subscriptionRepository
      .create({
        name: 'default',
        plan,
        trialEndsAt: plan.hasTrial() ? trial.end : null,
        startsAt: period.start,
        endsAt: plan.isFree() ? null : period.end,
        user,
      })
      .save();
  }

  subscription(user: User, name?: string): Promise<Subscription | undefined> {
    return this.subscriptionRepository.subscription(user, name);
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

  async canUseFeature(featureSlug: string): Promise<any> {
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

    if (usage) {
      // SubscriptionUsage.create({
      //   ...usage,
      //   used: usage.used + 500,
      // }).save();

      usage.used = (Number(usage.used) + 500).toString();

      usage.save();
    }

    const featureValue = feature.value ?? null;

    if (featureValue === 'true') {
      return true;
    }

    if (
      usage.expired() ||
      !featureValue ||
      featureValue === '0' ||
      featureValue === 'false'
    ) {
      return false;
    }

    return Number(featureValue) - Number(usage.used) > 0;
  }

  @OnEvent(EVENT_REGISTER, { async: true })
  async handleUserLoginEvent(user: User): Promise<void> {
    console.log(user);

    // const subscription = await this.subscription(user);

    // if (!subscription) {
    //   await this.create(user);
    // }
  }
}
