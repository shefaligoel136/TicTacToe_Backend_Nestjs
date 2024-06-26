import { PlayerSymbol } from 'src/Utilities/enum';
import { Game } from 'src/games/game.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerName: string;

  @Column({ type: 'enum', enum: PlayerSymbol })
  symbol: PlayerSymbol;

  @ManyToOne(() => Game)
  @JoinColumn()
  game: Game;
}
