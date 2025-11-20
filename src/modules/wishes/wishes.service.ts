// src/modules/wishes/wishes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm'; // 👈 THÊM IsNull
import { Wish } from 'src/entities/wish.entity';
import { CreateWishDto } from 'src/Dto/create-wish.dto';
import { UpdateWishDto } from 'src/Dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepo: Repository<Wish>,
  ) {}

  async findAll(onlyVerified?: boolean): Promise<Wish[]> {
    const qb = this.wishRepo
      .createQueryBuilder('wish')
      .where('wish.deletedAt IS NULL');

    if (onlyVerified) {
      qb.andWhere('wish.isVerified = :verified', { verified: true });
    }

    // Ưu tiên: đại biểu trước, rồi priority 1–3, rồi mới createdAt
    qb
      .orderBy('wish.isDelegate', 'DESC')
      .addOrderBy('wish.priority', 'ASC')
      .addOrderBy('wish.createdAt', 'DESC');

    return qb.getMany();
  }

  async create(dto: CreateWishDto): Promise<Wish> {
    const wish = this.wishRepo.create({
      senderName: dto.senderName.trim(),
      senderPosition: dto.senderPosition?.trim() || null,
      content: dto.content.trim(),
      isDelegate: dto.isDelegate ?? false,
      isVerified: false, // mới gửi lên mặc định chờ duyệt
      priority: '3',
    });

    return this.wishRepo.save(wish);
  }

  // ---- UPDATE CHO ADMIN ----
  async update(id: number, dto: UpdateWishDto): Promise<Wish> {
    const wish = await this.wishRepo.findOne({
      where: { id, deletedAt: IsNull() }, // 👈 DÙNG IsNull() THAY CHO null
    });

    if (!wish) {
      throw new NotFoundException('Wish không tồn tại');
    }

    if (dto.senderName !== undefined) {
      wish.senderName = dto.senderName.trim();
    }

    if (dto.senderPosition !== undefined) {
      wish.senderPosition = dto.senderPosition
        ? dto.senderPosition.trim()
        : null;
    }

    if (dto.content !== undefined) {
      wish.content = dto.content.trim();
    }

    if (dto.isDelegate !== undefined) {
      wish.isDelegate = dto.isDelegate;
    }

    if (dto.isVerified !== undefined) {
      wish.isVerified = dto.isVerified;
    }

    if (dto.priority !== undefined) {
      wish.priority = dto.priority;
    }

    return this.wishRepo.save(wish);
  }

  // ---- SOFT DELETE CHO ADMIN ----
  async softDelete(id: number): Promise<void> {
    const wish = await this.wishRepo.findOne({
      where: { id, deletedAt: IsNull() }, // 👈 DÙNG IsNull() Ở ĐÂY LUÔN
    });

    if (!wish) {
      throw new NotFoundException('Wish không tồn tại');
    }

    wish.deletedAt = new Date();
    await this.wishRepo.save(wish);
  }
}
