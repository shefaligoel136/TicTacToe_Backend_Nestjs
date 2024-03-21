import { Game } from 'src/games/game.model';
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
  row: string;

  @Column()
  column: string;

  @ManyToOne(() => Game)
  @JoinColumn()
  game: Game;
}
