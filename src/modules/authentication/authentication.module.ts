import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtRefreshTokenStrategy } from 'src/strategy/jwt-refresh-token.strategy';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
@Module({
  imports: [
    JwtModule.register({}), 
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  providers: [AuthenticationService,  JwtRefreshTokenStrategy, JwtStrategy],
  exports: [AuthenticationService, JwtModule,],
})
export class AuthenticationModule {}
