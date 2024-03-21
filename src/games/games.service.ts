import { HttpException, Injectable } from '@nestjs/common';
import { Game } from './game.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersService } from 'src/players/players.service';
import { PlayerSymbol } from 'src/Utilities/enum';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private playerService: PlayersService,
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

  async create(playerName: string): Promise<number> {
    try {
      const roomId = await this.generateRoomId();
      const game = await this.createGameInstance(roomId, playerName);
      if (!game) {
        throw new HttpException('Game cannot be started at the moment', 500);
      }
      return game.roomId;
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
      return roomId;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  findAll(): Promise<Game[]> {
    return this.gamesRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.gamesRepository.delete(id);
  }
}
