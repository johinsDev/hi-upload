import { File } from '../files/file.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Token } from './token.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(
    () => Token,
    token => token.user,
  )
  tokens: Token[];

  @OneToMany(
    () => File,
    file => file.user,
  )
  files: File[];

  @OneToMany(
    () => Subscription,
    subscription => subscription.user,
    {
      cascade: true,
    },
  )
  subscriptions: Subscription[];

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
