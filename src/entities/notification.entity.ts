// src/entities/notification.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type NotificationLevel = 'info' | 'success' | 'warning' | 'danger';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 20, default: 'info' })
  level: NotificationLevel;

  @Column({
    name: 'is_active',
    type: 'tinyint',
    width: 1,
    default: 1, // hoặc default: () => '1'
  })
  isActive: boolean;

  @Column({
    name: 'show_on_dashboard',
    type: 'tinyint',
    width: 1,
    default: 1, // hoặc default: () => '1'
  })
  showOnDashboard: boolean;

  @Column({
    name: 'start_time',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  startTime: Date | null;

  @Column({
    name: 'end_time',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  endTime: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
