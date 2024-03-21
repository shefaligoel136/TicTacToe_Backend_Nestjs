import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GamesService } from 'src/games/games.service';
import { PlayersService } from 'src/players/players.service';
import { GateWayMakeMoveDTO, GateWayRoomDTO } from './gateWayRoom.DTO';
import { GameStatus } from 'src/Utilities/enum';

interface Room {
  id: number;
  users: Set<Socket>;
}

@WebSocketGateway(8081, { cors: { origin: '*' } })
export class GatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly rooms: Room[] = [];

  constructor(
    private readonly playerService: PlayersService,
    private readonly gameService: GamesService,
  ) {}

  @WebSocketServer()
  server: Server;

  async canJoinRoom(roomId: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    const gameInstance = await this.gameService.findOne({ where: { roomId } });

    if (!gameInstance) {
      return {
        success: false,
        message: 'Game room does not exist',
      };
    }

    if (gameInstance.status !== GameStatus.WAITING_FOR_PLAYERS) {
      return {
        success: false,
        message: 'Game has already started',
      };
    }

    const player = await this.playerService.findAll({
      where: {
        game: gameInstance,
      },
    });

    console.log('player', player, gameInstance, player.length);

    if (player.length >= 2) {
      console.log('player', player, gameInstance, player.length);
      return {
        success: false,
        message: 'Room is Full',
      };
    }

    return {
      success: true,
    };
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      client.emit('connected', 'Successfully connected to the server.');
    } catch {
      return this.disconnect(client);
    }
  }

  private disconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
  }

  handleDisconnect() {
    this.server.emit('userLeft');
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GateWayRoomDTO,
  ) {
    try {
      client.data.roomIds ??= [];
      const { roomId } = data;

      if (client.data.roomIds.includes(roomId)) {
        return { success: true };
      }

      const canJoinRoom = await this.canJoinRoom(roomId as unknown as number);
      if (!canJoinRoom.success) {
        return canJoinRoom;
      }

      if (client.data.roomIds.length >= 2) {
        return {
          success: false,
          message: 'Room Size Exceeded',
        };
      }

      client.join(roomId as string);
      client.data.roomIds.push(roomId);
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: error?.response?.message || error.message,
      };
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GateWayMakeMoveDTO,
  ) {
    const { roomId, row, column, playerId } = data;
    console.log(data);
    const makeMove = await this.gameService.move(
      roomId as unknown as number,
      playerId,
      row,
      column,
    );
    this.server.to(roomId).emit('moveMade', { updatedGame: makeMove });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, @MessageBody() data: GateWayRoomDTO) {
    const { roomId } = data;
    client.leave(roomId);
  }
}
