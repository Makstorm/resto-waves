import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';
import { ShoesEntity, ShoesServiceTag } from '@domain';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesModule } from '../sizes';

@Module({
  imports: [TypeOrmModule.forFeature([ShoesEntity]), SizesModule],
  controllers: [ShoesController],
  providers: [{ provide: ShoesServiceTag, useClass: ShoesService }],
})
export class ShoesModule {}
