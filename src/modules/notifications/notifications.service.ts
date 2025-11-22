import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from 'src/Dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/Dto/update-notification.dto';
import { Notification } from 'src/entities/notification.entity';
import { Repository, Raw } from 'typeorm';
import { RealtimeGateway } from '../realtime/realtime.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
      private readonly realtime: RealtimeGateway,
  ) {}

  async findForDashboard(): Promise<Notification[]> {
    const now = new Date();

    return this.notificationRepo.find({
      where: {
        isActive: true,
        showOnDashboard: true,
        // startTime IS NULL OR startTime <= now
        startTime: Raw(
          (alias) => `${alias} IS NULL OR ${alias} <= :now`,
          { now },
        ),
        // endTime IS NULL OR endTime >= now
        endTime: Raw(
          (alias) => `${alias} IS NULL OR ${alias} >= :now`,
          { now },
        ),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

   async findAll(): Promise<Notification[]> {
    return this.notificationRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Notification> {
    const item = await this.notificationRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Notification #${id} không tồn tại`);
    }
    return item;
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const entity = this.notificationRepo.create({
      ...dto,
      startTime: dto.startTime ? new Date(dto.startTime) : null,
      endTime: dto.endTime ? new Date(dto.endTime) : null,
    });
    this.realtime.emitDashboardNotificationsRefresh()

    return this.notificationRepo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateNotificationDto,
  ): Promise<Notification> {
    const existing = await this.findOne(id);

    const merged = this.notificationRepo.merge(existing, {
      ...dto,
      startTime:
        dto.startTime !== undefined
          ? dto.startTime
            ? new Date(dto.startTime)
            : null
          : existing.startTime,
      endTime:
        dto.endTime !== undefined
          ? dto.endTime
            ? new Date(dto.endTime)
            : null
          : existing.endTime,
    });
    this.realtime.emitDashboardNotificationsRefresh()
    return this.notificationRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notificationRepo.delete(id);
    this.realtime.emitDashboardNotificationsRefresh()
    if (result.affected === 0) {
      throw new NotFoundException(`Notification #${id} không tồn tại`);
    }
  }
}
