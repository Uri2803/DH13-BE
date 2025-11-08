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
  ],
  controllers: [AppController],
  providers: [AppService, AuthenticationService],
})
export class AppModule {}
