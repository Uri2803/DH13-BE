// src/documents/documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity';

import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { RealtimeGateway } from '../realtime/realtime.service';
import { CreateDocumentDto } from 'src/Dto/create-document.dto';
import { UpdateDocumentDto } from 'src/Dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly configService: ConfigService,
   private readonly realtime: RealtimeGateway,
  ) {}

  private buildFileUrl(filePath: string): string {
    const baseUrl =
      this.configService.get<string>('PUBLIC_URL') ||
      'http://localhost:3000';

    const normalized = filePath.replace(/\\/g, '/');
    return `${baseUrl}/${normalized}`;
  }
  private normalizeIsPublic(input: any): boolean {
  // default: true nếu không gửi
  if (input === undefined || input === null || input === '') return true;

  if (typeof input === 'boolean') return input;

  if (typeof input === 'number') {
    // 1 → true, 0 → false
    return input === 1;
  }

  if (typeof input === 'string') {
    const s = input.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(s)) return true;
    if (['0', 'false', 'no', 'off'].includes(s)) return false;
  }

  // fallback an toàn
  return true;
}


  private mapToResponse(doc: Document) {
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      category: doc.category,
      isPublic: doc.isPublic,
      fileUrl: this.buildFileUrl(doc.filePath),
      uploadedBy: doc.uploadedByName ?? null, 
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

 

  async findAllForUser(user: any) {
    const where: any = {};
    if (user.role !== 'admin') {
      where.isPublic = true;
    }

    const docs = await this.documentRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return docs.map((d) => this.mapToResponse(d));
  }

  async create(dto: CreateDocumentDto, file: Express.Multer.File, user: any) {
    if (!file) {
      throw new NotFoundException('File tài liệu không được để trống');
    }

    const doc = new Document();
    doc.title = dto.title;
    doc.description = dto.description;
    doc.fileType = dto.fileType;
    doc.fileSize = dto.fileSize ?? null;
    doc.category = dto.category;
    doc.isPublic = this.normalizeIsPublic(dto.isPublic);
    doc.filePath = file.path.replace(/\\/g, '/');
    doc.uploadedByName = user?.name ?? null;

    const saved = await this.documentRepository.save(doc);
    this.realtime.emitDocumentsChanged();

    return this.mapToResponse(saved);
  }

  async update(
    id: number,
    dto: UpdateDocumentDto,
    file?: Express.Multer.File,
  ) {

    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Không tìm thấy tài liệu');

    const oldPath = doc.filePath;

    if (file) {
      doc.filePath = file.path.replace(/\\/g, '/');
    }

    if (dto.title !== undefined) doc.title = dto.title;
    if (dto.description !== undefined) doc.description = dto.description;
    if (dto.fileType !== undefined) doc.fileType = dto.fileType;
    if (dto.fileSize !== undefined) doc.fileSize = dto.fileSize;
    if (dto.category !== undefined) doc.category = dto.category;
    if (dto.isPublic !== undefined) {
    doc.isPublic = this.normalizeIsPublic(dto.isPublic);
    }


    const saved = await this.documentRepository.save(doc);

    if (file && oldPath && oldPath !== doc.filePath) {
      try {
        await fs.unlink(path.resolve(oldPath));
      } catch {
      }
    }
    console.log(saved)

    this.realtime.emitDocumentsChanged();

    return this.mapToResponse(saved);
  }

  async remove(id: number) {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Không tìm thấy tài liệu');

    const filePath = doc.filePath;

    await this.documentRepository.remove(doc);

    if (filePath) {
      try {
        await fs.unlink(path.resolve(filePath));
      } catch {
      }
    }
    this.realtime.emitDocumentsChanged();

    return { success: true };
  }
}
