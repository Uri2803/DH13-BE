// src/image/image.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

import { ImageType } from 'src/common/enum';
import { Image } from 'src/entities/image.entity';
import { ImageService } from './images.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // 1. Lấy danh sách ảnh. FE sẽ gọi:
  // - /images           -> tất cả
  // - /images?type=hero -> chỉ hero
  @Get()
  findAll(@Body('type') type?: ImageType): Promise<Image[]> {
    if (type) {
      return this.imageService.findByType(type);
    }
    return this.imageService.findAll();
  }

  // 2. Upload nhiều ảnh (field name = 'image')
  //    FE: formData.append('image', file)
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('type') type: ImageType,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    if (!type) {
      throw new BadRequestException('Image type is required');
    }
    return this.imageService.uploadAndSave(files, type);
  }

  // 3. Cập nhật 1 ảnh (đổi file)
  //    FE chỉ gửi 1 file -> updateImage(id, file, type)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: ImageType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!type) {
      throw new BadRequestException('Image type is required');
    }
    return this.imageService.updateOne(id, file, type);
  }

  // 4. Xóa ảnh
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }
}
