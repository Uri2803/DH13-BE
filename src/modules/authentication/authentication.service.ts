import { Injectable } from '@nestjs/common';
import {JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthenticationService {
    constructor(
         private readonly jwtService: JwtService, 
            private readonly userService: UserService,
            private readonly configService: ConfigService
    ) {}

    public async getCookiesWithJwtAccessToken(user: User): Promise<string> {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            code: user.code,
            department: user.department || null,
         };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
        });
        return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }

    public async getCookiesWithJwtRefreshToken(user: User): Promise<string> {
        const payload = { userId: user.id };
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')
        });
        return `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut(): string {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public getUserFromAuthenticationToken(token: string) {
        const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });
        if (payload.userId) {
            return this.userService.getById(payload.userId);
        }
    }

    async validateUser(code: string, password: string): Promise<User | null> {
        const user = await this.userService.getByCode(code);
        if (user && await this.userService.isPasswordValid(password, user.password)) {
            return user;
        }
        return null;
    }

    public async login(userCode: string, password: string) {
        const user = await this.validateUser(userCode, password);
        if (!user) {
            return null;
        }
        const accessToken = await this.getCookiesWithJwtAccessToken(user);
        const refreshToken = await this.getCookiesWithJwtRefreshToken(user);
        const { password: _, currentHashedRefreshToken, ...userData } = user;
        return { 
            user: userData,
            accessToken,
            refreshToken
        };
    }
}
