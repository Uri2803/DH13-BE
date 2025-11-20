import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';

// DTO này khớp với payload mà kịch bản Python gửi lên
export class ImportDelegateDto {
  @IsNumber()
  departmentId: number;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  mssv?: string;

  @IsString()
  @IsOptional()
  avatarBase64?: string; // Định dạng: data:image/png;base64,....

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  mssv_or_mscb?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsEnum(['Nam', 'Nữ', 'Khác'])
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsDateString()
  @IsOptional()
  joinUnionDate?: string;

  @IsDateString()
  @IsOptional()
  joinAssociationDate?: string;

  @IsBoolean()
  @IsOptional()
  isPartyMember?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  studentYear?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  academicScore?: number;

  @IsString()
  @IsOptional()
  achievements?: string;
  
  @IsString()
  @IsOptional()
  shirtSize?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}