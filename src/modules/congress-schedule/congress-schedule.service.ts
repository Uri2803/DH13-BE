import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CongressScheduleItem } from '../../entities/congress-schedule-item.entity';
import { CreateCongressScheduleItemDto } from 'src/Dto/create-congress-schedule-item.dto';
import { UpdateCongressScheduleItemDto } from 'src/Dto/update-congress-schedule-item.dto';
import { RealtimeGateway } from '../realtime/realtime.service';

@Injectable()
export class CongressScheduleService {
  constructor(
    @InjectRepository(CongressScheduleItem)
    private readonly scheduleRepo: Repository<CongressScheduleItem>,
    private readonly realtime: RealtimeGateway,
  ) {}

  async findForDashboard(): Promise<CongressScheduleItem[]> {
    return this.scheduleRepo
      .createQueryBuilder('item')
      .orderBy('item.orderIndex', 'ASC')
      .addOrderBy('item.startTime', 'ASC')
      .getMany();
  }

  async findAll(): Promise<CongressScheduleItem[]> {
    return this.scheduleRepo.find({
      order: {
        orderIndex: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<CongressScheduleItem> {
    const item = await this.scheduleRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Schedule item #${id} không tồn tại`);
    }
    return item;
  }

  async create(
    dto: CreateCongressScheduleItemDto,
  ): Promise<CongressScheduleItem> {
    const entity = this.scheduleRepo.create({
      ...dto,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : null,
    });
    this.realtime.emitDashboardScheduleRefresh()

    return this.scheduleRepo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateCongressScheduleItemDto,
  ): Promise<CongressScheduleItem> {
    const existing = await this.findOne(id);

    const merged = this.scheduleRepo.merge(existing, {
      ...dto,
      startTime:
        dto.startTime !== undefined
          ? new Date(dto.startTime)
          : existing.startTime,
      endTime:
        dto.endTime !== undefined
          ? dto.endTime
            ? new Date(dto.endTime)
            : null
          : existing.endTime,
    });
    this.realtime.emitDashboardScheduleRefresh()
    return this.scheduleRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepo.delete(id);
    this.realtime.emitDashboardScheduleRefresh()
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule item #${id} không tồn tại`);
    }
  }
}
