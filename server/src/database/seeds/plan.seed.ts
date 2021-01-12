import { Plan } from '../../subscription/entities/plan.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import slugify from 'slugify';
import { PlanFeatures } from '../../subscription/entities/plan-features.entity';

export default class CreatePlan implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const PlanFree = await factory(Plan)().create({
      name: 'Free',
      description: 'Free description',
      slug: slugify('Free', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });

    const PlanMedium = await factory(Plan)().create({
      name: 'Medium',
      description: 'Medium description',
      price: 9.99,
      slug: slugify('Medium', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });

    const PlanPro = await factory(Plan)().create({
      name: 'Pro',
      description: 'Pro description',
      price: 14.99,
      slug: slugify('Pro', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });

    await factory(PlanFeatures)().create({
      name: 'Storage space free',
      value: '500000',
      plan: PlanFree,
      description: 'space storage',
      slug: slugify('Storage space free', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });

    await factory(PlanFeatures)().create({
      name: 'Storage space medium',
      value: '1500000',
      description: 'space storage',
      plan: PlanMedium,
      slug: slugify('Storage space medium', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });

    await factory(PlanFeatures)().create({
      name: 'Storage space pro',
      value: 'true',
      description: 'space storage',
      plan: PlanPro,
      slug: slugify('Storage space pro', {
        lower: true,
        strict: true,
        replacement: '-',
      }),
    });
  }
}
