import { Body, Controller, Get, Post, Req, Res, UseGuards, HttpCode, Put, Param, UseInterceptors, UploadedFile, BadRequestException, Patch } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthenticationService } from '../authentication/authentication.service';
import JwtAuthGuard from 'src/guard/jwt-authentication.guard';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/common/enum';
import {Roles} from 'src/common/roles.decorator'
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateDelegateDto } from 'src/Dto/create-delegate.dto';

const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

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

    @Get('resetchecin')
    @Roles(Role.ADMIN)
    resetCheckin(@Param('id') id: string) {
      return this.userService.resetCheckin(); // bạn đã có hàm này
    }


    @Post('admin/delegates')
    @UseInterceptors(
      FileInterceptor('avatar', {
        storage: avatarStorage,
      }),
    )
    async createDelegate(
      @Body() dto: CreateDelegateDto,
      @UploadedFile() avatar?: Express.Multer.File,
    ) {
      return this.userService.createOne(dto, avatar);
    }

    @Patch('admin/delegates/:id')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.DEPARTMENT)
    @UseInterceptors(FileInterceptor('avatar', { storage: avatarStorage }))
    async updateDelegate(
      @Param('id') id: string,
      @Body() dto: Partial<CreateDelegateDto>, 
      @UploadedFile() avatar?: Express.Multer.File,
    ) {
      const result= await this.userService.updateOne(+id, dto, avatar);
      return result;
    }

    // -------------------------------------------

    @UseGuards(JwtAuthGuard)
    @Put('me/password')
    async changePassword(
      @Req() req: Request,
      @Body() body: { currentPassword: string; newPassword: string },
    ) {
      const userId = (req as any).user.id;
      await this.userService.changePassword(
        userId,
        body.currentPassword,
        body.newPassword,
      );
      return { ok: true };
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileInterceptor('avatar', {
        storage: avatarStorage,
      }),
    )
    @Put('me/avatar')
    async updateAvatar(
      @Req() req: Request,
      @UploadedFile() file: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('File avatar là bắt buộc');
      }
      const userId = (req as any).user.id;
      const user = await this.userService.updateAvatar(userId, file);
      return { ok: true, user };
    }
}