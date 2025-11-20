// src/modules/wishes/wishes.controller.ts
import { Controller, Get, Post, Query, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { WishesService } from './wishes.service';

import { Wish } from 'src/entities/wish.entity';
import { CreateWishDto } from 'src/Dto/create-wish.dto';
import { UpdateWishDto } from 'src/Dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get()
  findAll(
    @Query('onlyVerified') onlyVerified?: string,
  ): Promise<Wish[]> {
    const isOnlyVerified = onlyVerified === 'true' || onlyVerified === '1';
    return this.wishesService.findAll(isOnlyVerified);
  }

  @Post()
  create(@Body() dto: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(dto);
  }

    @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.wishesService.softDelete(id);
  }
}
