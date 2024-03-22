import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Game } from './game.model';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersService } from 'src/players/players.service';
import { GameStatus, PlayerSymbol } from 'src/Utilities/enum';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CellService } from 'src/cell/cell.service';
import { CellMoveDTOResponse } from 'src/cell/cell.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private playerService: PlayersService,
    @Inject(forwardRef(() => CellService))
    private readonly cellService: CellService,
  ) {}

  async generateRoomId(): Promise<number> {
    try {
      const roomId = Math.floor(100000 + Math.random() * 900000);
      const roomIdExists = await this.gamesRepository.findOne({
        where: { roomId },
      });
      if (roomIdExists) {
        await this.generateRoomId();
      }
      return roomId;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createGameInstance(roomId: number, playerName: string): Promise<Game> {
    try {
      const game = await this.gamesRepository.create({
        roomId,
      });
      const saveGame = await this.gamesRepository.save(game);
      if (!saveGame) {
        throw new HttpException('Error in creating game', 500);
      }

      await this.playerService.create(playerName, saveGame, PlayerSymbol.X);
      return game;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(playerName: string): Promise<string> {
    try {
      const roomId = await this.generateRoomId();
      const game = await this.createGameInstance(roomId, playerName);
      if (!game) {
        throw new HttpException('Game cannot be started at the moment', 500);
      }
      return game.roomId as unknown as string;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async join(playerName: string, roomId: number): Promise<number> {
    try {
      const findGameByRoomId = await this.gamesRepository.findOne({
        where: { roomId },
      });
      if (!findGameByRoomId) {
        throw new HttpException('RoomId does not exists', 404);
      }
      await this.playerService.create(
        playerName,
        findGameByRoomId,
        PlayerSymbol.O,
      );
      await this.update(findGameByRoomId.id, {
        status: GameStatus.INPROGRESS,
      });
      return roomId;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async move(
    roomId: number,
    playerId: number,
    row: number,
    column: number,
  ): Promise<CellMoveDTOResponse> {
    try {
      return await this.cellService.move(row, column, roomId, playerId);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(filter: FindOneOptions<Game>): Promise<Game> {
    const gameInstance = await this.gamesRepository.findOne(filter);
    if (!gameInstance) {
      throw new HttpException('Game does not exists as per filters', 404);
    }
    return gameInstance;
  }

  async findById(id: number): Promise<Game> {
    const gameInstance = await this.gamesRepository.findOne({ where: { id } });
    if (!gameInstance) {
      throw new HttpException('Game does not exists', 404);
    }
    return gameInstance;
  }

  async update(
    id: number,
    data: QueryDeepPartialEntity<Game>,
  ): Promise<UpdateResult> {
    try {
      await this.findById(id);
      const updateGame = await this.gamesRepository.update({ id }, data);
      return updateGame;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
