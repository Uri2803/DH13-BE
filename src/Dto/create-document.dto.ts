// src/documents/dto/create-document.dto.ts
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export const DOCUMENT_FILE_TYPES = ['PDF', 'Word', 'Excel', 'PowerPoint', 'Khác'] as const;
export type DocumentFileType = (typeof DOCUMENT_FILE_TYPES)[number];

export const DOCUMENT_CATEGORIES = ['Nghị quyết', 'Báo cáo', 'Danh sách', 'Quy chế', 'Khác'] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsString()
  @IsIn(DOCUMENT_FILE_TYPES)
  fileType: DocumentFileType;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  fileSize?: string | null; 

  @IsString()
  @IsIn(DOCUMENT_CATEGORIES)
  category: DocumentCategory;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
