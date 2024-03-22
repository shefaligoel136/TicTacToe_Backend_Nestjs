import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GateWayRoomDTO {
  @IsNotEmpty()
  @Type(() => String)
  playerName: string;

  @IsNotEmpty()
  roomId: string;
}

export class GateWayMakeMoveDTO {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  row: number;

  @IsNotEmpty()
  column: number;

  @IsNotEmpty()
  playerId: number;
}
