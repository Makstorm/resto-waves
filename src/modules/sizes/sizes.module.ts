import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { SizeEntity, SizeServiceTag } from '@domain';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SizeEntity])],
  controllers: [SizesController],
  providers: [{ provide: SizeServiceTag, useClass: SizesService }],
  exports: [SizeServiceTag],
})
export class SizesModule {}
