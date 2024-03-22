import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
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

  async findById(id: number): Promise<Player> {
    return await this.playersRepository.findOneBy({ id });
  }

  async findAll(options?: FindManyOptions<Player>): Promise<Player[]> {
    return await this.playersRepository.find(options);
  }

  async findByIdAndGame(id: number, game: Game): Promise<Player> {
    try {
      const playerInstance = await this.playersRepository.findOneBy({
        id,
        game,
      });
      if (!playerInstance) {
        throw new HttpException('Player not found in the room!', 404);
      }
      return playerInstance;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
