import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import {
  IShoesService,
  UpdateShoeDto,
  CreateShoeDto,
  ShoesServiceTag,
} from '@domain';

@ApiTags('Shoes')
@Controller('shoes')
export class ShoesController {
  @Inject(ShoesServiceTag)
  private readonly shoesService: IShoesService;

  @Post()
  public async create(@Body() createShoeDto: CreateShoeDto) {
    return this.shoesService.create(createShoeDto);
  }

  @Get()
  public async findAll() {
    return this.shoesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shoesService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShoeDto: UpdateShoeDto,
  ) {
    return this.shoesService.update(id, updateShoeDto);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.shoesService.remove(id);
  }

  @Post('/compare')
  public async compareWithDatabase() {
    await this.shoesService.compareWithDatabase();
  }
}
