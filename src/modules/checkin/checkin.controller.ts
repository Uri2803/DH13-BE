import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { CheckinService } from './checkin.service';
import JwtAuthGuard from 'src/guard/jwt-authentication.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/enum';

@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkin: CheckinService) {}

  // Quét QR: body: { token: "CHK1.<jwt>" | "<jwt>" }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.DEPARTMENT)
  @Post('qr')
  async checkinByQr(@Body() body: { token: string }) {
    const raw = body?.token?.trim() ?? '';
    const token = raw.startsWith('CHK1.') ? raw.slice(5) : raw;
    const di = await this.checkin.checkinByQrToken(token);
    return {
      ok: true,
      delegate: {
        id: di.id,
        code: di.code,
        fullName: di.user?.name,
        unit: di.user?.department?.name,
        position: di.position,
        checkedIn: di.checkedIn,
        checkinTime: di.checkinTime,
      },
    };
  }

  // Điểm danh thủ công theo delegateInfoId
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post(':delegateInfoId')
  async checkinManual(@Param('delegateInfoId') id: string) {
    const di = await this.checkin.checkinByDelegateInfoId(+id);
    return {
      ok: true,
      delegate: {
        id: di.id,
        code: di.code,
        fullName: di.user?.name,
        unit: di.user?.department?.name,
        position: di.position,
        checkedIn: di.checkedIn,
        checkinTime: di.checkinTime,
      },
    };
  }

  // (Tuỳ chọn) tạo ảnh QR PNG để in thẻ
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('qr-image/:delegateInfoId')
  async qrPng(@Param('delegateInfoId') id: string, @Res() res: Response) {
    // tạo token & ảnh QR
    const token = this.checkin.createQrToken(+id);
    const content = `CHK1.${token}`;

    // tránh thêm lib mới, bạn có thể cài `qrcode`
    // npm i qrcode
    const QRCode = require('qrcode');
    res.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(res, content, { margin: 1, width: 500 });
  }


  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('qr-Funcion/:Funcionid')
  async qrPngFuncion(@Param('delegateInfoId') id: string, @Res() res: Response) {
    // tạo token & ảnh QR
    const token = this.checkin.createQrToken(+id);
    const content = `CHK1.${token}`;

    // tránh thêm lib mới, bạn có thể cài `qrcode`
    // npm i qrcode
    const QRCode = require('qrcode');
    res.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(res, content, { margin: 1, width: 500 });
  }

  

}
