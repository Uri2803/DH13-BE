// src/entities/delegate_info.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity('delegate_info')
export class DelegateInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.delegateInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Department, (department) => department.delegates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Mã đại biểu',
  })
  code?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Chức vụ',
  })
  position?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'MSSV hoặc MSCB',
  })
  mssv_or_mscb?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Ngày sinh',
  })
  dateOfBirth?: string; // "YYYY-MM-DD"

  @Column({
    type: 'enum',
    enum: ['Nam', 'Nữ', 'Khác'],
    nullable: true,
  })
  gender?: 'Nam' | 'Nữ' | 'Khác';

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Tôn giáo',
  })
  religion?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Dân tộc',
  })
  ethnicity?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Ngày vào Đoàn',
  })
  joinUnionDate?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Ngày vào Hội',
  })
  joinAssociationDate?: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: false,
    comment: 'Đảng viên',
  })
  isPartyMember: boolean;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Sinh viên năm',
  })
  studentYear?: number;

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    comment: 'Điểm học tập',
  })
  academicScore?: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Thành tích',
  })
  achievements?: string;

  @Column({
    type: 'enum',
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    nullable: true,
    comment: 'Cỡ áo',
  })
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'tinyint',
    width: 1,
    default: false,
  })
  checkedIn: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  checkinTime?: Date;

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
}
