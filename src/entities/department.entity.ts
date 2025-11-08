// src/entities/department.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { DelegateInfo } from './delegate_info.entity';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => DelegateInfo, (delegateInfo) => delegateInfo.department)
  delegates: DelegateInfo[];
}
