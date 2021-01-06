import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { interval } from '../period.service';
import { Plan } from './plan.entity';
import { SubscriptionUsage } from './subscription-usage.entity';

@Entity()
export class PlanFeatures extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(
    () => Plan,
    plan => plan.features,
  )
  @JoinTable()
  plans: Plan[];

  @OneToMany(
    () => SubscriptionUsage,
    subscriptionUsage => subscriptionUsage.features,
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

  @Column({
    type: 'bigint',
  })
  value: number;

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
