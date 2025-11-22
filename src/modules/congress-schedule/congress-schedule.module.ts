import { Module } from '@nestjs/common';
import { CongressScheduleController } from './congress-schedule.controller';
import { CongressScheduleService } from './congress-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RealtimeModule } from '../realtime/realtime.module';
import { CongressScheduleItem } from 'src/entities/congress-schedule-item.entity';

@Module({
  imports: [
        TypeOrmModule.forFeature([CongressScheduleItem]),
        JwtModule.register({}),
        ConfigModule,
        RealtimeModule
      ],
  controllers: [CongressScheduleController],
  providers: [CongressScheduleService]
})
export class CongressScheduleModule {}
