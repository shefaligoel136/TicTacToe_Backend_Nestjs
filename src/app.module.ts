import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USERNAME', 'root'),
        password: configService.get('DATABASE_PASSWORD', ''),
        database: configService.get('DATABASE_NAME', 'TicTacToe'),
        entities: [Player, Game, Cell],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
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
