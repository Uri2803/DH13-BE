import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('documents')
export class Document {
  // id INT UNSIGNED NOT NULL AUTO_INCREMENT
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // title VARCHAR(255) NOT NULL
  @Column({ type: 'varchar', length: 255 })
  title: string;

  // description TEXT NOT NULL
  @Column({ type: 'text' })
  description: string;

  // file_type VARCHAR(50) NOT NULL
  @Column({ name: 'file_type', type: 'varchar', length: 50 })
  fileType: string;

  // file_size VARCHAR(100) NULL
  // QUAN TRỌNG: Phải có type: 'varchar' để tránh lỗi "Data type Object not supported"
  @Column({ name: 'file_size', type: 'varchar', length: 100, nullable: true })
  fileSize: string | null;

  // category VARCHAR(100) NOT NULL
  @Column({ type: 'varchar', length: 100 })
  category: string;

  // is_public TINYINT(1) NOT NULL DEFAULT 1
  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  // file_path VARCHAR(255) NOT NULL
  @Column({ name: 'file_path', type: 'varchar', length: 255 })
  filePath: string;

  // uploaded_by_name VARCHAR(255) NULL
  // QUAN TRỌNG: Phải có type: 'varchar'
  @Column({ name: 'uploaded_by_name', type: 'varchar', length: 255, nullable: true })
  uploadedByName: string | null;

  // created_at DATETIME(6)
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  // updated_at DATETIME(6)
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;
}