// src/wishes/dto/create-wish.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWishDto {
  @IsString()
  senderName: string;

  @IsOptional()
  @IsString()
  senderPosition?: string;

  // [MỚI] Thêm trường này để nhận avatar từ Frontend
  @IsOptional()
  @IsString()
  senderAvatar?: string; 

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isDelegate?: boolean;
}