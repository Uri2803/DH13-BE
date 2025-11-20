// src/entities/wish.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('wishes')
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senderName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  senderPosition: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isDelegate: boolean;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: ['1', '2', '3'],
    default: '3',
  })
  priority: '1' | '2' | '3';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
