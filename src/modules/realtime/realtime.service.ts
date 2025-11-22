import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private cfg: ConfigService, private jwt: JwtService) {}

  afterInit() {
    // nếu scale: setAdapter(redisAdapter)
  }

  async handleConnection(client: Socket) {
    try {
      // Nhận token từ query hoặc headers (handshake)
      const token = (client.handshake.auth?.token || client.handshake.headers['x-access-token']) as string;
      if (token) {
        const payload = this.jwt.verify(token, { secret: this.cfg.get('JWT_SECRET') });
        (client as any).user = payload;
        // join theo vai trò / khoa để bắn room-targeted
        if (payload.role === 'admin') client.join('admins');
        if (payload.facultyId) client.join(`faculty:${payload.facultyId}`);
      }
    } catch {
      // có thể ngắt kết nối nếu bắt buộc auth
      // client.disconnect();
    }
  }

  handleDisconnect() { /* noop */ }

  // === Ví dụ kênh test
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    client.emit('pong', { now: Date.now(), data });
  }

  // --------- Helpers để emit sự kiện domain ----------
  emitCheckinUpdated(payload: { delegateId: number; checkedIn: boolean; checkinTime?: string }) {
    this.server.emit('checkin.updated', payload);
  }
  emitWishCreated(payload: { id: string; senderName: string; content: string; createdAt: string }) {
    this.server.emit('wish.created', payload);
  }
  emitDocumentUpdated(payload: { id: string; isActive: boolean }) {
    // chỉ admin UI cần? có thể emit cho room 'admins'
    this.server.to('admins').emit('document.updated', payload);
  }
  emitCongressUpdate(payload: { id: string; title: string; createdAt: string; imageUrl?: string }) {
    this.server.emit('congressUpdate.created', payload);
  }
  emitDocumentsChanged() {
    this.server.emit('documents:changed');
  }

  emitDashboardNotificationsRefresh() {
    this.server.emit('dashboard:notifications:refresh');
  }
  emitDashboardScheduleRefresh() {
    this.server.emit('dashboard:schedule:refresh');
  }
}
