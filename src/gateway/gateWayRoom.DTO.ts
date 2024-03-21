import { IsNotEmpty } from 'class-validator';

export class GateWayRoomDTO {
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
