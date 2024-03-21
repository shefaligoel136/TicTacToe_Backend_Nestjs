import { Module } from '@nestjs/common';
import { CellService } from './cell.service';
import { CellController } from './cell.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './cell.model';

@Module({
  imports: [TypeOrmModule.forFeature([Cell])],
  controllers: [CellController],
  providers: [CellService],
  exports: [CellService],
})
export class CellModule {}
