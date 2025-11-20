// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { DelegateInfo } from './delegate_info.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // code VARCHAR(50) DEFAULT NULL
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  code?: string;

  // email VARCHAR(255) NOT NULL UNIQUE
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  // name VARCHAR(255) DEFAULT NULL
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name?: string;

  // mssv VARCHAR(255) DEFAULT NULL
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  mssv?: string;

  // ava VARCHAR(255) DEFAULT NULL
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  ava?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: ['delegate', 'admin', 'department'],
    default: 'delegate',
  })
  role: 'delegate' | 'admin' | 'department';

  @Column({
    type: 'tinyint',
    width: 1,
    default: false,
  })
  hasContactInfo: boolean;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  currentHashedRefreshToken?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => Department, (department) => department.users, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department?: Department;

  @OneToOne(() => DelegateInfo, (delegateInfo) => delegateInfo.user)
  delegateInfo?: DelegateInfo;
}
