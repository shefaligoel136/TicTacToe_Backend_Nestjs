import { Module, forwardRef } from '@nestjs/common';
import { CellService } from './cell.service';
import { CellController } from './cell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './cell.model';
import { GamesModule } from 'src/games/games.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cell]),
    forwardRef(() => GamesModule),
    PlayersModule,
  ],
  controllers: [CellController],
  providers: [CellService],
  exports: [CellService],
})
export class CellModule {}
