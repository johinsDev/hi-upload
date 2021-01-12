import { Plan } from '../../subscription/entities/plan.entity';
import { define } from 'typeorm-seeding';

define(Plan, () => {
  const plan = new Plan();

  plan.currency = 'USD';
  return plan;
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
