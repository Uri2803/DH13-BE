import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CongressScheduleService } from './congress-schedule.service';
import { CongressScheduleItem } from '../../entities/congress-schedule-item.entity';
import { UpdateCongressScheduleItemDto } from 'src/Dto/update-congress-schedule-item.dto';
import { CreateCongressScheduleItemDto } from 'src/Dto/create-congress-schedule-item.dto';

@Controller('congress-schedule')
export class CongressScheduleController {
  constructor(private readonly congressScheduleService: CongressScheduleService) {}

  /**
   * GET /congress-schedule/dashboard
   */
  @Get('dashboard')
  async getDashboardSchedule(): Promise<CongressScheduleItem[]> {
    return this.congressScheduleService.findForDashboard();
  }

  @Get()
  async findAll(): Promise<CongressScheduleItem[]> {
    return this.congressScheduleService.findAll();
  }

  /**
   * GET /congress-schedule/:id
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CongressScheduleItem> {
    return this.congressScheduleService.findOne(id);
  }

  /**
   * POST /congress-schedule
   * Tạo mới
   */
  @Post()
  async create(
    @Body() dto: CreateCongressScheduleItemDto,
  ): Promise<CongressScheduleItem> {
    return this.congressScheduleService.create(dto);
  }

  /**
   * PATCH /congress-schedule/:id
   * Cập nhật
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCongressScheduleItemDto,
  ): Promise<CongressScheduleItem> {
    return this.congressScheduleService.update(id, dto);
  }

  /**
   * DELETE /congress-schedule/:id
   * Xoá
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.congressScheduleService.remove(id);
  }
}
