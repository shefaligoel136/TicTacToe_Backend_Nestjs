import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @Type(() => String)
  playerName: string;
}

export class JoinGameDto {
  @IsNotEmpty()
  @Type(() => String)
  playerName: string;

  @IsNotEmpty()
  @Type(() => Number)
  roomId: number;
}

export class MakeMoveDTO {
  @IsNotEmpty()
  @Type(() => Number)
  playerId: number;

  @IsNotEmpty()
  @Type(() => Number)
  roomId: number;

  @IsNotEmpty()
  @Type(() => Number)
  row: number;

  @IsNotEmpty()
  @Type(() => Number)
  column: number;
}
