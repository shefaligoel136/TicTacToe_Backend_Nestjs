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
