import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.model';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), PlayersModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
