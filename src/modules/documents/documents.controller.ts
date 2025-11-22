// src/documents/documents.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import JwtAuthGuard from 'src/guard/jwt-authentication.guard';
import { Roles } from 'src/common/roles.decorator';
import { CreateDocumentDto } from 'src/Dto/create-document.dto';
import { UpdateDocumentDto } from 'src/Dto/update-document.dto';

const documentStorage = diskStorage({
  destination: './uploads/documents',
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.documentsService.findAllForUser(req.user);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: documentStorage,
      limits: {
        fileSize: 50 * 1024 * 1024, // 20MB
      },
    }),
  )
  async create(
    @Body() dto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.documentsService.create(dto, file, req.user);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: documentStorage,
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentsService.update(id, dto, file);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
