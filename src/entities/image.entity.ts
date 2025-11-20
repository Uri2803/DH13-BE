import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ImageType } from 'src/common/enum';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;
}
