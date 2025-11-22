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

  // [FIX LỖI TẠI ĐÂY]
  // Đổi từ 'senderAvatar?: string' thành 'string | null'
  // Để khớp với việc Service gán giá trị null và DB nullable: true
  @Column({
    type: 'varchar',
    length: 500, // Nên tăng length lên 500 phòng trường hợp URL ảnh dài
    nullable: true,
  })
  senderAvatar: string | null; 

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