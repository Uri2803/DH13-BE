import { Module,  forwardRef} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports:[
    forwardRef(() => AuthenticationModule),
    TypeOrmModule.forFeature([User]),

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
