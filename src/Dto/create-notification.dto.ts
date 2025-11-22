// src/notifications/dto/create-notification.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsIn(['info', 'success', 'warning', 'danger'])
  level?: 'info' | 'success' | 'warning' | 'danger';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  showOnDashboard?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string | null;

  @IsOptional()
  @IsDateString()
  endTime?: string | null;
}
