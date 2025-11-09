import { Module,  forwardRef} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { DelegateInfo } from 'src/entities/delegate_info.entity';
import { Department } from 'src/entities/department.entity';
@Module({
  imports:[
    forwardRef(() => AuthenticationModule),
    TypeOrmModule.forFeature([User, DelegateInfo, Department]),
    RealtimeModule,

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
