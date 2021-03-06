import { User } from '../../auth/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Plan } from './plan.entity';
import { SubscriptionUsage } from './subscription-usage.entity';
import * as dayjs from 'dayjs';
@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => SubscriptionUsage,
    usages => usages.subscription,
    {
      cascade: true,
    },
  )
  usages: SubscriptionUsage[];

  @ManyToOne(
    () => User,
    user => user.subscriptions,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  user: User;

  @ManyToOne(
    () => Plan,
    plan => plan.subscription,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  plan: Plan;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  trialEndsAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startsAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  endsAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  cancelsAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  canceledAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  onGracePeriod(): boolean {
    return this.endsAt && dayjs(this.endsAt).isAfter(dayjs());
  }

  onTrial(): boolean {
    return this.trialEndsAt && dayjs(this.trialEndsAt).isAfter(dayjs());
  }

  active(): boolean {
    return !this.endsAt || this.onGracePeriod();
  }

  valid(): boolean {
    return this.active() || this.onTrial() || this.onGracePeriod();
  }
}
