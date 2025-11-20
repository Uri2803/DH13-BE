// src/image/dto/create-image.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ImageType } from 'src/common/enum';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsEnum(['activities', 'hero'])
  type: ImageType;
}
