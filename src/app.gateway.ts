import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { Socket, Server} from 'socket.io';
import { Logger,Inject } from '@nestjs/common';
import { IDatabase } from 'pg-promise';
import { QueryDto,BodyDto } from './dto/index';

import { 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage, 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  WsResponse } from '@nestjs/websockets';


@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>) {}
  
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');
  
  afterInit(server: Server) {
    this.logger.log('Initalized');
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnection. ${client.id}`);
    try {
      let user = await this.pg.query(`update users set online = false where socket_id = $1 returning *`, [client.id])
      this.wss.emit('disconnect_user', user)
    } catch (error) {
      console.log(error)
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connection. ${client.id}`);
  }

  @SubscribeMessage('connection')
  async data(client:Socket, num:number): Promise<void>{
    try {
      const user = await this.pg.query(`update users set socket_id = $1, online = true where user_id = $2 returning user_id , username`, [client.id,num])
      this.wss.emit('online', user)
    } catch (error) {
      console.log(error)
    }
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, text: BodyDto): Promise<void> {
    try {
      let user = await this.pg.query(`select socket_id from users where user_id = $1`,[text.to_user_id] )
      let msg = await this.pg.query(`insert into chats (from_user_id, to_user_id, message) values ($1,$2,$3) returning *`,[text.from_user_id, text.to_user_id, text.message ] )
      this.wss.to(user[0].socket_id).emit('message:ToClient', msg)
      this.wss.to(client.id).emit('message:ToClient', msg)
    } catch (error) {
      console.log(error)
    }
  }
}
