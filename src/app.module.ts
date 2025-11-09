import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation-schema';
import { DepartmentModule } from './modules/department/department.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AuthenticationService } from './modules/authentication/authentication.service';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { WishesModule } from './modules/wishes/wishes.module';
import { CheckinModule } from './modules/checkin/checkin.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      validationSchema,
      validationOptions: {
        allowUnknown: true, 
        abortEarly: true,
      },
    }),
    DatabaseModule,
    DepartmentModule,
    UserModule,
    AuthenticationModule,
    RealtimeModule,
    WishesModule,
    CheckinModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
