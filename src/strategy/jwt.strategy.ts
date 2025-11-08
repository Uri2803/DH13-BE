import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { Reflector } from '@nestjs/core';
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private reflector : Reflector,


    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if(!jwtSecret){
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        
    }
     async validate(payload: any) {
        const user = await this.userService.getById(payload.sub);
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            department: user?.department || null,
        };
    
    }
}