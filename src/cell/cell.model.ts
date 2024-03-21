import { Game } from 'src/games/game.model';
import { Player } from 'src/players/players.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cell {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row: number;

  @Column()
  column: number;

  @ManyToOne(() => Game)
  @JoinColumn()
  game: Game;

  @ManyToOne(() => Player)
  @JoinColumn()
  player: Player;
}
