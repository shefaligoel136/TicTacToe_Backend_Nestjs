import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './players.model';
import { PlayerSymbol } from 'src/Utilities/enum';
import { Game } from 'src/games/game.model';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  // TODO: ADD VALIDATION FOR LIMIT ON ROOM SIZE i.e. 2.
  async create(
    playerName: string,
    game: Game,
    symbol: PlayerSymbol,
  ): Promise<Player> {
    try {
      const player = this.playersRepository.create({
        playerName,
        game,
        symbol,
      });
      const savePlayer = await this.playersRepository.save(player);
      if (!savePlayer) {
        throw new HttpException('Player cannot be created at the moment!', 500);
      }
      return player;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  findOne(id: number): Promise<Player | null> {
    return this.playersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.playersRepository.delete(id);
  }
}
