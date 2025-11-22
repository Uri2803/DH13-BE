import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCongressScheduleItemDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string | null;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string | null; // 'green' | 'blue' | 'gray' ...

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}
