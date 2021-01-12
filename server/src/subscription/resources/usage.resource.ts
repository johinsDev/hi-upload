import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PlanFeatures } from '../entities/plan-features.entity';
import { PlanFeatureResource } from './plan-feature.resource';

@Exclude()
export class UsageResource {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PlanFeatureResource)
  feature: PlanFeatures;

  @Expose()
  @Transform(value => {
    if (value === 'false') {
      return false;
    }

    if (value === 'true') {
      return true;
    }

    if (!isNaN(Number(value))) {
      return Number(value);
    }

    return value;
  })
  used: string | boolean | number;

  constructor(partial: Partial<UsageResource>) {
    Object.assign(this, partial);
  }
}
