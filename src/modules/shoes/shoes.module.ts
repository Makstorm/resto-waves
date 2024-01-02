import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';
import { ShoesEntity, ShoesServiceTag, ShoesSizeEntity } from '@domain';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesModule } from '../sizes';
import { GoogleModule } from '../google';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoesEntity, ShoesSizeEntity]),
    SizesModule,
    GoogleModule,
  ],
  controllers: [ShoesController],
  providers: [{ provide: ShoesServiceTag, useClass: ShoesService }],
})
export class ShoesModule {}
