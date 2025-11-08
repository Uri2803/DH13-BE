// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, } from 'typeorm';
import { Department } from './department.entity';
import { DelegateInfo } from './delegate_info.entity';
import { Exclude } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  mssv: string;

  @Column({ nullable: true })
  ava: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['delegate', 'admin', 'department'], default: 'delegate' })
  role: string;

  @Column({ default: false })
  hasContactInfo: boolean;

  @Exclude()
  @Column({ nullable: true })
  currentHashedRefreshToken: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Department, (department) => department.users, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  department: Department;

  @OneToOne(() => DelegateInfo, (delegateInfo) => delegateInfo.user)
  delegateInfo: DelegateInfo;
}
