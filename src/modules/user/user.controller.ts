// user.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards, HttpCode, Put, Param } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthenticationService } from '../authentication/authentication.service';
import JwtAuthGuard from 'src/guard/jwt-authentication.guard';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/common/enum';
import {Roles} from 'src/common/roles.decorator'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: { userCode: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessTokenCookie, refreshTokenCookie } =
      await this.authenticationService.login(body.userCode, body.password);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInfor(@Req() req: Request) {
    return this.userService.getById((req as any).user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateInfor(
    @Body() data: any
  ){
    console.log(data)
    return await this.userService.updateInfor(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.DEPARTMENT)
  @Get('department/:id')
  async getUserForDeparment(@Param('id') id: string){
    return await this.userService.getUserByDepartment(+id);

  }



}
