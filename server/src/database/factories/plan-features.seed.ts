import { define } from 'typeorm-seeding';
import { PlanFeatures } from '../../subscription/entities/plan-features.entity';

define(PlanFeatures, () => {
  const planFeature = new PlanFeatures();

  return planFeature;
});

// define(Plan, () => {
//   const plan = new Plan();
//   plan.name = 'Medium';
//   plan.description = 'Medium description';
//   plan.slug = slugify('Medium', {
//     lower: true,
//     strict: true,
//     replacement: '-',
//   });
//   plan.price = 9.99;
//   plan.currency = 'USD';
//   return plan;
// });

// define(Plan, () => {
//   const plan = new Plan();
//   plan.name = 'Large';
//   plan.description = 'Large description';
//   plan.slug = slugify('Large', {
//     lower: true,
//     strict: true,
//     replacement: '-',
//   });
//   plan.price = 14.99;
//   plan.currency = 'USD';
//   return plan;
// });
