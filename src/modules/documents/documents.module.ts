import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Document]),
      JwtModule.register({}),
      ConfigModule,
      RealtimeModule
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
