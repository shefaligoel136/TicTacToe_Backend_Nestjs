import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/games/game.model';
import { Player } from 'src/players/players.model';
import { Cell } from './cell.model';
import { GamesService } from 'src/games/games.service';
import { GameStatus } from 'src/Utilities/enum';
import { PlayersService } from 'src/players/players.service';
import { CellMoveDTOResponse } from './cell.dto';

@Injectable()
export class CellService {
  constructor(
    @InjectRepository(Cell)
    private readonly cellRepository: Repository<Cell>,
    @Inject(forwardRef(() => GamesService))
    private readonly gameService: GamesService,
    private readonly playerService: PlayersService,
  ) {}

  async move(
    row: number,
    column: number,
    roomId: number,
    playerId: number,
  ): Promise<CellMoveDTOResponse> {
    try {
      const game = await this.gameService.findOne({ where: { roomId } });
      const player = await this.playerService.findByIdAndGame(playerId, game);

      if (!this.isValidMove(row, column)) {
        throw new HttpException(
          'Invalid Move: Row and column numbers must be between 1 and 3',
          HttpStatus.BAD_REQUEST,
        );
      }

      const cellInstance = await this.cellRepository.findOne({
        where: { row, column, game },
      });

      if (cellInstance && cellInstance.player !== null) {
        throw new HttpException(
          'Invalid Move: This cell is already occupied',
          HttpStatus.BAD_REQUEST,
        );
      }

      const savedCell = await this.fillCell(row, column, game, player);

      const winningPlayer = await this.checkGameWon(game, player);
      if (winningPlayer) {
        await this.endGameWithWinner(game, winningPlayer);
        return this.buildResponse(
          `Player ${winningPlayer.playerName} with sign ${winningPlayer.symbol} won!`,
          savedCell,
          winningPlayer,
        );
      }

      if (await this.checkGameDraw(game)) {
        await this.endGameWithTie(game);
        return this.buildResponse(
          'There is a tie between the players',
          savedCell,
        );
      }

      return this.buildResponse('Next player can make the move', savedCell);
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while processing the move',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async fillCell(
    row: number,
    column: number,
    game: Game,
    player: Player,
  ): Promise<Cell> {
    const fillCell = this.cellRepository.create({ row, column, game, player });
    return await this.cellRepository.save(fillCell);
  }

  private async checkGameWon(
    game: Game,
    player: Player,
  ): Promise<Player | null> {
    const cells = await this.cellRepository.find({ where: { game } });
    const playerCells = cells.filter(
      (cell) => cell.player && cell.player.id === player.id,
    );
    const winningConditions = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9], // rows
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9], // columns
      [1, 5, 9],
      [3, 5, 7], // diagonals
    ];

    for (const condition of winningConditions) {
      if (
        condition.every((cell) =>
          playerCells.some(
            (pc) =>
              pc.row === Math.floor((cell - 1) / 3) + 1 &&
              pc.column === ((cell - 1) % 3) + 1,
          ),
        )
      ) {
        return player;
      }
    }

    return null;
  }

  private async checkGameDraw(game: Game): Promise<boolean> {
    const cells = await this.cellRepository.find({ where: { game } });
    return cells.length === 9 && cells.every((cell) => !!cell.player);
  }

  private async endGameWithWinner(game: Game, player: Player): Promise<void> {
    game.winner = player;
    await this.gameService.update(game.id, {
      winner: player,
      status: GameStatus.ENDED,
    });
  }

  private async endGameWithTie(game: Game): Promise<void> {
    await this.gameService.update(game.id, { status: GameStatus.TIE });
  }

  private isValidMove(row: number, column: number): boolean {
    return row >= 1 && row <= 3 && column >= 1 && column <= 3;
  }

  private buildResponse(
    message: string,
    cell: Cell,
    player?: Player,
  ): CellMoveDTOResponse {
    return { message, cell, player };
  }
}
