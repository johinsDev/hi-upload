import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { PlanFeatures } from './entities/plan-features.entity';

@EntityRepository(PlanFeatures)
export class PlanFeatureRepository extends Repository<PlanFeatures> {
  findBySlug(user: User, slug: string): Promise<PlanFeatures> {
    return this.createQueryBuilder('features')
      .innerJoinAndSelect('features.plans', 'plans')
      .innerJoinAndSelect('plans.subscription', 'subscription')
      .innerJoin('subscription.user', 'user')
      .where('subscription.name = :name', { name: 'default' })
      .andWhere('user.id = :userId', {
        userId: user.id,
      })
      .andWhere('features.slug = :slug', {
        slug,
      })
      .getOne();
  }
}
