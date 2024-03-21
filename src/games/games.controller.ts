import { Body, Controller, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, JoinGameDto, MakeMoveDTO } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('/')
  async create(@Body() gameData: CreateGameDto) {
    try {
      const { playerName } = gameData;
      return await this.gamesService.create(playerName);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Post('/join')
  async join(@Body() joinGameData: JoinGameDto) {
    try {
      const { playerName, roomId } = joinGameData;
      return await this.gamesService.join(playerName, roomId);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Post('/move')
  async move(@Body() makeMoveDTO: MakeMoveDTO) {
    try {
      const { roomId, row, column, playerId } = makeMoveDTO;
      return await this.gamesService.move(roomId, playerId, row, column);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
