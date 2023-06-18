import { Logger } from '@nestjs/common';

import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { ConvertPriceDto } from './convert.price.dto';
import { DefaultRoom } from './default.room.enum';
import { PriceSendToAllRQ } from './send.to.all.rq.dto';
import { map } from 'rxjs'

@WebSocketGateway({

  path: '/price/',
  cors: {
    origin: '*',
  },
  pingTimeout: 60000
  // transports: ['websocket']
})
export class PriceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('PriceWebSocket');
  @WebSocketServer()
  server: Server;
  roomNames: string[] = []

  constructor() {}

  getPriceConvert(res: any){
    res.to_crypto == 'irr' ? this.sendToAllPricesConvert(res) : this.sendToAllPricesConvertNoneIrr(res)
  }

  getPriceOtc(res: any){
    res.to == "irr" ? this.sendToAllPricesOtc(res) : this.sendToAllPricesOtcNoneIrr(res)
  }

  afterInit(server: Server) {
    this.logger.log('price gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.joinToRoom(client);
    this.logger.log(`price client connected and joined to room: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.leaveFromRoom(client);
    this.logger.log(`price client disconnected and leave from room: ${client.id}`);
  }

  joinToRoom(client: Socket): void {
    client.join(DefaultRoom.ALL_PRICES);
  }

  @SubscribeMessage('test')
  async identity(@MessageBody() data: number): Promise<number> {
    return 200000;
  }

  leaveFromRoom(client: Socket): void {
    client.leave(DefaultRoom.ALL_PRICES);
  }

  @SubscribeMessage('leaveall')
  async leaveAllFromRoom(): Promise<void> {
    this.server.socketsLeave(DefaultRoom.ALL_PRICES)
  }

  sendToAll(msg: Record<string, any>) {
    this.server.of("/").to(DefaultRoom.ALL_PRICES).emit('priceToClient', { type: 'price', message: msg })
  }


  @SubscribeMessage("joinroom")
  async joinUserToRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    const findRoomNames = this.roomNames.find(item => item.toLowerCase() == room.toLowerCase())
    if (findRoomNames) {
      client.join(room.toLowerCase())
      const sockets = await this.server.of("/").in(room).fetchSockets()
      this.logger.log(`User Joined to: ${room} , Room number : ${sockets.length}`)
    }

  }


  @SubscribeMessage("leaveroom")
  async leaveUserOfRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    const findRoomNames = this.roomNames.find(item => item.toLowerCase() == room.toLowerCase())
    if (findRoomNames) {
      client.leave(room.toLowerCase())
      const sockets = await this.server.of("/").in(room).fetchSockets()
      this.logger.log(`User Leaved: ${room} , Room number : ${sockets.length}`)
    }
  }

  sendToAllPricesOtc(msg: PriceSendToAllRQ) {
    this.broadCastMessage(DefaultRoom.ALL_PRICES, `otc_${msg.channel}`, msg)
  }

  sendToAllPricesConvert(msg: ConvertPriceDto) {
    this.broadCastMessage(DefaultRoom.ALL_PRICES, `convert_${msg.channel}`, msg)
  }

  sendToAllPricesConvertNoneIrr(msg: ConvertPriceDto) {
    this.broadCastMessage(`convert_${msg.from_crypto.toLowerCase()}_${msg.to_crypto.toLowerCase()}`, `convert_${msg.channel}`, msg)
  }

  sendToAllPricesOtcNoneIrr(msg: PriceSendToAllRQ) {
    this.broadCastMessage(`otc_${msg.from.toLowerCase()}_${msg.to.toLowerCase()}`, `otc_${msg.channel}`, msg)
  }

  getClients(server: Server): Set<string> {
    const clients = server.sockets.adapter.rooms.get(DefaultRoom.ALL_PRICES);

    return clients;
  }

  getClientsQnty(server: Server): number {
    const clients = server.sockets.adapter.rooms.get(DefaultRoom.ALL_PRICES);
    return clients ? clients.size : 0;
  }

  broadCastMessage(room: string, event: string, msg) {
    try {
      this.roomNames.find(item => item == room) ? null : this.roomNames.push(room)
      this.server.of("/").to(room).emit(event, { type: "price", message: msg })
    } catch (e) {
    }
  }

  @SubscribeMessage("leaveallroom")
  leaveAllRoom(@ConnectedSocket() socket: Socket) {
    for (const roomName of this.roomNames) {
      if (roomName !== DefaultRoom.ALL_PRICES)
        socket.leave(roomName)
    }
  }
}