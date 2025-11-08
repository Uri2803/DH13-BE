interface TokenPayload {
    userId: number,
    isSecondFactorAuthenticated?: boolean;
}
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { Request } from "express";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        const jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
        if(!jwtRefreshSecret){
            throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtRefreshSecret,
        });
    }

    async validate(payload: TokenPayload) {
        const user = await this.userService.getById(payload.userId);
        return {
            id: payload.userId,
            isSecondFactorAuthenticated: payload.isSecondFactorAuthenticated,
            email: user?.email,
            role: user?.role,
            department: user?.department || null,
        };
    }
}
