import { EntityRepository, Repository } from 'typeorm';
import { PlanFeatures } from './entities/plan-features.entity';
import { Plan } from './entities/plan.entity';

@EntityRepository(PlanFeatures)
export class PlanFeatureRepository extends Repository<PlanFeatures> {
  findBySlug(plan: Plan, slug: string): Promise<PlanFeatures> {
    return this.findOne({
      where: [
        {
          slug,
          plan,
        },
      ],
    });
  }
}
