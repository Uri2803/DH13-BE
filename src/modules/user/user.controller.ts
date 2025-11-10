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

  @Get('delegates')
  @Roles(Role.ADMIN)
  getAllDelegates() {
    return this.userService.findDelegates(); // chỉ role = 'delegate'
  }

  @Get('department/:id')
  @Roles(Role.DEPARTMENT, Role.ADMIN)
  getByDepartment(@Param('id') id: string) {
    return this.userService.getUserByDepartment(+id); // bạn đã có hàm này
  }

  @Get('delegates/:id')
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  async getDelegateById(@Param('id') id: string) {
    const item = await this.userService.findDelegateById(Number(id));
    return { ok: true, item };
  }

  @HttpCode(200)
    @Post('refresh')
        async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const r = req.cookies?.['Refresh'];
        if (!r) return { ok: false, message: 'No refresh cookie' };

        const { accessCookie, refreshCookie, accessToken } =
            await this.authenticationService.refreshTokens(r);

        res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
        return { ok: true, accessToken };
    }

    @HttpCode(200)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const r = req.cookies?.['Refresh'];
        const { clearAccess, clearRefresh } =
            await this.authenticationService.logout(r);

        res.setHeader('Set-Cookie', [clearAccess, clearRefresh]);
        return { ok: true };
    }

  

}



