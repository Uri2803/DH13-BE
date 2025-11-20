// src/image/images.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/entities/image.entity';
import { ImageType } from 'src/common/enum';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  // Lưu vào uploads/images
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'images');

  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    private readonly configService: ConfigService,
  ) {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  findAll(): Promise<Image[]> {
    return this.imageRepo.find({ order: { id: 'DESC' } });
  }

  findByType(type: ImageType): Promise<Image[]> {
    return this.imageRepo.find({
      where: { type },
      order: { id: 'DESC' },
    });
  }

  // Tạo file + bản ghi DB cho N ảnh
  async uploadAndSave(
    files: Array<Express.Multer.File>,
    type: ImageType,
  ): Promise<Image[]> {
    const newImages: Image[] = [];

    const baseUrl =
      this.configService.get<string>('PUBLIC_URL') || 'http://localhost:3000';

    for (const file of files) {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const fileName = `image-${uniqueSuffix}${ext}`;

        const filePath = path.join(this.uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);

        const image = new Image();
        // URL public mà FE sẽ dùng để hiển thị
        image.imageUrl = `${baseUrl}/uploads/images/${fileName}`;
        image.type = type;

        newImages.push(image);
      } catch (error) {
        console.error(`Error saving file ${file.originalname}:`, error);
        throw new InternalServerErrorException('Failed to save image to disk');
      }
    }

    return this.imageRepo.save(newImages);
  }

  // Update 1 ảnh: xóa file cũ, lưu file mới, cập nhật DB
  async updateOne(
    id: number,
    file: Express.Multer.File,
    type: ImageType,
  ): Promise<Image> {
    const img = await this.imageRepo.findOne({ where: { id } });
    if (!img) {
      throw new NotFoundException('Image not found');
    }

    // Xóa file cũ
    const oldFileName = img.imageUrl.split('/').pop();
    if (oldFileName) {
      const oldPath = path.join(this.uploadDir, oldFileName);
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.error('Error deleting old image file:', err);
      }
    }

    // Lưu file mới
    const baseUrl =
      this.configService.get<string>('PUBLIC_URL') || 'http://localhost:3000';

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const fileName = `image-${uniqueSuffix}${ext}`;
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    img.imageUrl = `${baseUrl}/uploads/images/${fileName}`;
    img.type = type;

    return this.imageRepo.save(img);
  }

  async remove(id: number): Promise<void> {
    const img = await this.imageRepo.findOne({ where: { id } });
    if (!img) {
      throw new NotFoundException('Image not found');
    }

    const fileName = img.imageUrl.split('/').pop();
    if (fileName) {
      const filePath = path.join(this.uploadDir, fileName);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error deleting physical file:', err);
      }
    }

    await this.imageRepo.delete(id);
  }
}
