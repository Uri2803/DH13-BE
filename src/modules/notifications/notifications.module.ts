import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RealtimeModule } from '../realtime/realtime.module';
import { Notification } from 'src/entities/notification.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Notification]),
      JwtModule.register({}),
      ConfigModule,
      RealtimeModule

    ],
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
