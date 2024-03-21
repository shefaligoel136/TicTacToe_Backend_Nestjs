import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { PlayersModule } from 'src/players/players.module';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [PlayersModule, GamesModule],
  controllers: [],
  providers: [GatewayService],
  exports: [],
})
export class GatewayModule {}
