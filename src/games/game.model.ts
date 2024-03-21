import { GameStatus } from 'src/Utilities/enum';
import { Player } from 'src/players/players.model';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: number;

  @OneToOne(() => Player)
  @JoinColumn()
  winner: Player;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING_FOR_PLAYERS,
  })
  status: GameStatus;
}
