export class DelegateInfoEntity {}
// src/entities/delegate-info.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity('delegate_info')
export class DelegateInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.delegateInfo, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, comment: 'Mã đại biểu' })
  code: string;

  @ManyToOne(() => Department, (department) => department.delegates, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  department: Department;

  @Column({ nullable: true, comment: 'Chức vụ' })
  position: string;

  @Column({ nullable: true, comment: 'MSSV hoặc MSCB' })
  mssv_or_mscb: string;

  @Column({ type: 'date', nullable: true, comment: 'Ngày sinh' })
  dateOfBirth: string;

  @Column({ type: 'enum', enum: ['Nam', 'Nữ', 'Khác'], nullable: true })
  gender: string;

  @Column({ nullable: true, comment: 'Tôn giáo' })
  religion: string;

  @Column({ nullable: true, comment: 'Dân tộc' })
  ethnicity: string;

  @Column({ type: 'date', nullable: true, comment: 'Ngày vào Đoàn' })
  joinUnionDate: string;

  @Column({ type: 'date', nullable: true, comment: 'Ngày vào Hội' })
  joinAssociationDate: string;

  @Column({ default: false, comment: 'Đảng viên' })
  isPartyMember: boolean;

  @Column({ nullable: true, comment: 'Sinh viên năm' })
  studentYear: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, comment: 'Điểm học tập' })
  academicScore: number;

  @Column({ type: 'text', nullable: true, comment: 'Thành tích' })
  achievements: string;

  @Column({ type: 'enum', enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], nullable: true, comment: 'Cỡ áo' })
  shirtSize: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  checkedIn: boolean;

  @Column({ type: 'timestamp', nullable: true })
  checkinTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
