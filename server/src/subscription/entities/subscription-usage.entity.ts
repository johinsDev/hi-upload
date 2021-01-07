import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { PlanFeatures } from './plan-features.entity';
import { Subscription } from './subscription.entity';
import * as dayjs from 'dayjs';

@Entity()
export class SubscriptionUsage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Subscription,
    subscription => subscription.usages,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  subscription: Subscription;

  @ManyToOne(
    () => PlanFeatures,
    planFeatures => planFeatures.usages,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  features: PlanFeatures;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  validUntil: Date | null;

  @Column({
    unsigned: true,
  })
  used: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  expired(): boolean {
    return this.validUntil && dayjs(this.validUntil).isBefore(dayjs());
  }
}
