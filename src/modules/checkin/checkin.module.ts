import { Module } from '@nestjs/common';
import { CheckinController } from './checkin.controller';
import { CheckinService } from './checkin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegateInfo } from 'src/entities/delegate_info.entity';
import { RealtimeGateway } from '../realtime/realtime.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DelegateInfo]),
    JwtModule.register({}),
    ConfigModule,
    RealtimeModule
  ],
  controllers: [CheckinController],
  providers: [CheckinService, RealtimeGateway]
})
export class CheckinModule {}
