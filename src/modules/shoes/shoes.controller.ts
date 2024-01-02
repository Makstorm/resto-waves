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
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import {
  IShoesService,
  UpdateShoeDto,
  CreateShoeDto,
  ShoesServiceTag,
  ShoeFilter,
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
  public async findAll(@Query() filter?: ShoeFilter) {
    if (filter.size) {
      return await this.shoesService.findBySize(filter.size);
    }

    return await this.shoesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.shoesService.findOne(id);
  }

  // @Get('/size/getmany')
  // public async findOneBySize(@Query() filter: ShoeFilter) {
  //   return await this.shoesService.findOneBySize(filter.size);
  // }

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
