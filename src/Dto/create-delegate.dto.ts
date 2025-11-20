// src/delegates/dto/create-delegate.dto.ts
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDelegateDto {
  // USER
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  mssv?: string; // MSSV (Định dạng TEXT)

  @IsOptional()
  @IsString()
  code?: string; // mã user nếu muốn

  @IsOptional()
  @IsString()
  password?: string; // nếu không gửi thì sẽ set default

  @IsString()
  departmentCode: string; // map từ "ĐƠN VỊ" → code khoa

  // DELEGATE INFO
  @IsOptional()
  @IsString()
  delegateCode?: string; // MÃ ĐẠI BIỂU

  @IsOptional()
  @IsString()
  position?: string; // CHỨC VỤ

  @IsOptional()
  @IsString()
  mssv_or_mscb?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string; // "YYYY-MM-DD"

  @IsOptional()
  @IsEnum(['Nam', 'Nữ', 'Khác'], { message: 'gender must be Nam | Nữ | Khác' })
  gender?: 'Nam' | 'Nữ' | 'Khác';

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  ethnicity?: string;

  @IsOptional()
  @IsString()
  joinUnionDate?: string;

  @IsOptional()
  @IsString()
  joinAssociationDate?: string;

  @IsOptional()
  @IsBoolean()
  isPartyMember?: boolean;

  @IsOptional()
  @IsNumber()
  studentYear?: number;

  @IsOptional()
  @IsNumber()
  academicScore?: number; 

  @IsOptional()
  @IsString()
  achievements?: string;

  @IsOptional()
  @IsEnum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  shirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emailContact?: string; 
}
