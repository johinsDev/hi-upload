import { Exclude, Expose, Type } from 'class-transformer';
import { UsageResource } from './usage.resource';

@Exclude()
export class PlanFeatureResource {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  value: string;

  @Expose()
  @Type(() => UsageResource)
  usages: UsageResource[];

  @Expose()
  remaining: number;

  // @Expose()
  // @Transform((_, obj: PlanFeatures) => {
  //   return obj.usages.reduce((acc, current) => acc + Number(current.used), 0);
  // })
  // usage: number;

  constructor(partial: Partial<PlanFeatureResource>) {
    Object.assign(this, partial);
  }
}
