import { Player } from 'src/players/players.model';
import { Cell } from './cell.model';
import { IsEmpty } from 'class-validator';

export class CellMoveDTOResponse {
  @IsEmpty()
  cell?: Cell;

  @IsEmpty()
  player?: Player;

  @IsEmpty()
  message?: string;
}
