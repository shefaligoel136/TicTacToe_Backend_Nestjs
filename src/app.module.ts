import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { GamesModule } from './games/games.module';
import { CellModule } from './cell/cell.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './players/players.model';
import { Game } from './games/game.model';
import { Cell } from './cell/cell.model';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'TicTacToe',
      entities: [Player, Game, Cell],
      autoLoadEntities: true,
      synchronize: true,
    }),
    GatewayModule,
    PlayersModule,
    GamesModule,
    CellModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
