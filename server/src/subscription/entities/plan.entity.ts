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
import { PlanFeatures } from './plan-features.entity';
import { Subscription } from './subscription.entity';

// @TODO --> enum month, day, hour, year et
// todo slug, puede ser en el servicio o tambien en la insercion
// crear planes como en el tuto
@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(
    () => PlanFeatures,
    planFeature => planFeature.plans,
    {
      cascade: true,
    },
  )
  features: PlanFeatures[];

  @OneToMany(
    () => Subscription,
    subscription => subscription.plan,
    {
      cascade: true,
    },
  )
  subscription: Subscription;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'decimal',
    default: 0.0,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    default: 0.0,
    scale: 2,
  })
  signupFee: number;

  @Column({
    type: 'smallint',
    default: 0,
    unsigned: true,
  })
  trialPeriod: number;

  @Column({
    length: 3,
  })
  currency: string;

  @Column({
    default: 'day',
  })
  trialInterval: interval;

  @Column({
    default: 0,
    unsigned: true,
    type: 'smallint',
  })
  invoicePeriod: number;

  @Column({
    default: 'month',
  })
  invoiceInterval: interval;

  @Column({
    default: 0,
    unsigned: true,
    type: 'smallint',
  })
  gracePeriod: number;

  @Column({
    default: 'day',
  })
  graceInterval: string;

  @Column({
    unsigned: true,
    nullable: true,
    type: 'smallint',
  })
  prorateDay: number;

  @Column({
    unsigned: true,
    nullable: true,
    type: 'smallint',
  })
  proratePeriod: string;

  @Column({
    unsigned: true,
    nullable: true,
    type: 'smallint',
  })
  prorateExtendDue: string;

  @Column({
    nullable: true,
    unsigned: true,
    type: 'smallint',
  })
  activeSubscribersLimit: number;

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

  isFree(): boolean {
    return this.price <= 0.0;
  }

  hasTrial(): boolean {
    return !!this.trialPeriod && !!this.trialInterval;
  }

  hasGrace(): boolean {
    return !!this.gracePeriod && !!this.graceInterval;
  }
}
