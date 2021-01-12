import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { interval } from '../period.service';
import { Plan } from './plan.entity';
import { SubscriptionUsage } from './subscription-usage.entity';

@Entity()
export class PlanFeatures extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Plan,
    plan => plan.features,
  )
  plan: Plan;

  @OneToMany(
    () => SubscriptionUsage,
    subscriptionUsage => subscriptionUsage.feature,
    {
      cascade: true,
    },
  )
  usages: SubscriptionUsage[];

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  value: string;

  @Column({
    default: 'month',
  })
  resettableInterval: interval;

  @Column({
    default: 0,
    unsigned: true,
    type: 'smallint',
  })
  resettablePeriod: number;

  @Column({
    default: 0,
    unsigned: true,
    type: 'integer',
  })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
