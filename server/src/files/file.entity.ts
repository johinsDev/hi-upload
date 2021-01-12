import { User } from '../auth/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  path: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  size: number;

  @ManyToOne(
    () => User,
    user => user.files,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
