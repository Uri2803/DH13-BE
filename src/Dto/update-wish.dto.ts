// src/Dto/update-wish.dto.ts
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  senderName?: string;

  @IsOptional()
  @IsString()
  senderPosition?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isDelegate?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsIn(['1', '2', '3'])
  priority?: '1' | '2' | '3';
}
