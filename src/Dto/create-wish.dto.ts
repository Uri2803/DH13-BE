// src/modules/wishes/dto/create-wish.dto.ts
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  senderName: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  senderPosition?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsBoolean()
  @IsOptional()
  isDelegate?: boolean;
}
