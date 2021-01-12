import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { PlanFeatures } from '../entities/plan-features.entity';
import { PlanFeatureResource } from './plan-feature.resource';
import * as currency from 'currency.js';

// @TODO integration with exchange rates for calc differrent prices, use cron and exchagnge api, currency COP
// class money with currency js for transform data
@Exclude()
export class PlanResource {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  name: string;

  @Expose()
  isActive: boolean;

  @Expose()
  price: number;

  @Expose()
  @Transform((_, obj) => currency(obj.price).format())
  priceFormatter: number;

  @Expose()
  currency: string;

  @Expose()
  @Type(() => PlanFeatureResource)
  features: PlanFeatures[];

  constructor(partial: Partial<PlanResource>) {
    Object.assign(this, partial);
  }
}
