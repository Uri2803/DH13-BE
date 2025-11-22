import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../entities/notification.entity';
import { UpdateNotificationDto } from 'src/Dto/update-notification.dto';
import { CreateNotificationDto } from 'src/Dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('dashboard')
  async getDashboardNotifications(): Promise<Notification[]> {
    return this.notificationsService.findForDashboard();
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  /**
   * GET /notifications/:id
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  /**
   * POST /notifications
   * Tạo mới
   */
  @Post()
  async create(
    @Body() dto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.create(dto);
  }

  /**
   * PATCH /notifications/:id
   * Cập nhật
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, dto);
  }

  /**
   * DELETE /notifications/:id
   * Xoá
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notificationsService.remove(id);
  }
}
