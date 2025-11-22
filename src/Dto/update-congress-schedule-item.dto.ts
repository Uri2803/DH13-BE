import { PartialType } from '@nestjs/mapped-types';
import { CreateCongressScheduleItemDto } from './create-congress-schedule-item.dto';

export class UpdateCongressScheduleItemDto extends PartialType(
  CreateCongressScheduleItemDto,
) {}
