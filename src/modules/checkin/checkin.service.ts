import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DelegateInfo } from 'src/entities/delegate_info.entity';
import { RealtimeGateway } from '../realtime/realtime.service';

type QrPayload = {
  typ: 'qr-checkin';
  delegateCode: string;
  eventId?: number;
  sub: string;       // delegateInfoId
  iat?: number;
  exp?: number;
};

@Injectable()
export class CheckinService {
  constructor(
     private readonly jwtService: JwtService, 
    private readonly cfg: ConfigService,
    @InjectRepository(DelegateInfo)
    private readonly delegateInfoRepo: Repository<DelegateInfo>,
    private readonly realtime: RealtimeGateway,
  ) {}

  createQrToken(delegateCode: string, eventId?: number) {
    const payload: QrPayload = {
      typ: 'qr-checkin',
      delegateCode,
      eventId,
      sub: delegateCode,
    };
    const token = this.jwtService.sign(payload, {
        secret: this.cfg.get<string>('QR_TOKEN_SECRET'),
        expiresIn: this.cfg.get('QR_TOKEN_EXPIRATION_TIME') ?? '30d',
    });
    return token;
  }

  verifyQrToken(token: string): QrPayload {
    try{

    
    const payload = this.jwtService.verify(token, {
      secret: this.cfg.get<string>('QR_TOKEN_SECRET'),
    }) as QrPayload;
    if (payload?.typ !== 'qr-checkin' || !payload?.delegateCode) {
      throw new HttpException('QR token invalid', HttpStatus.UNAUTHORIZED);
    }
    return payload;
    }catch(err){
        throw new HttpException('QR token invalid', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkinByDelegateInfoId(delegateInfoId: number) {
    const di = await this.delegateInfoRepo.findOne({ where: { id: delegateInfoId }, relations: ['user', 'user.department'] });
    if (!di) throw new HttpException('Delegate not found', HttpStatus.NOT_FOUND);

    // if (di.checkedIn){

    //  return di; 
    // }

    di.checkedIn = true;
    di.checkinTime = new Date();
    const saved = await this.delegateInfoRepo.save(di);

    this.realtime.emitCheckinUpdated({
      delegateId: saved.id,
      checkedIn: true,
      checkinTime: saved.checkinTime?.toISOString(),
    });

    return saved;
  }

     async checkinByDelegateCode(delegateCode: string) {
    const di = await this.delegateInfoRepo.findOne({ where: { code: delegateCode}, relations: ['user', 'user.department'] });
    if (!di) throw new HttpException('Delegate not found', HttpStatus.NOT_FOUND);
    di.checkedIn = true;
    di.checkinTime = new Date();
    const saved = await this.delegateInfoRepo.save(di);

    this.realtime.emitCheckinUpdated({
      delegateId: saved.id,
      checkedIn: true,
      checkinTime: saved.checkinTime?.toISOString(),
    });

    return saved;
  }
  

  async checkinByQrToken(token: string) {
    const payload = this.verifyQrToken(token);
    return this.checkinByDelegateCode(payload.delegateCode);
  }
  


 
}
