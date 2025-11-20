import { Module } from '@nestjs/common';
import { ImageService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './images.controller';
import { Image } from 'src/entities/image.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Image])],
  providers: [ImageService],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImagesModule {}
