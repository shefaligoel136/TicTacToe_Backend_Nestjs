import { Body, Controller, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, JoinGameDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('/')
  create(@Body() gameData: CreateGameDto) {
    try {
      const { playerName } = gameData;
      return this.gamesService.create(playerName);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Post('/join')
  join(@Body() joinGameData: JoinGameDto) {
    try {
      const { playerName, roomId } = joinGameData;
      return this.gamesService.join(playerName, roomId);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
