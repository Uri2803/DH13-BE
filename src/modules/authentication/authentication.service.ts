// authentication.service.ts
import { Injectable , HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private getAccessTokenCookie(user: User): string {
    const payload = {
      sub: user.id,               
      email: user.email,
      role: user.role,
      code: user.code,
      department: user.department || null,
    };
   const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Path=/; Secure; SameSite=None;  Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  private getRefreshTokenCookie(userId: number): { cookie: string; token: string } {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    // Dev (HTTP): KHÔNG set Secure. Nếu deploy cross-site => dùng SameSite=None; Secure
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Path=/; Secure; SameSite=None;  Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return { cookie, token };
  }

  async validateUser(code: string, password: string): Promise<User | null> {
    const user = await this.userService.getByCode(code);
    if (user && await this.userService.isPasswordValid(password, user.password)) {
      return user;
    }
    return null;
  }

  public async login(userCode: string, password: string) {
    if (!userCode || !password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.validateUser(userCode, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessTokenCookie = this.getAccessTokenCookie(user);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.getRefreshTokenCookie(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    // Trả cookie string về cho Controller set
    return { user, accessTokenCookie, refreshTokenCookie };
  }
}
