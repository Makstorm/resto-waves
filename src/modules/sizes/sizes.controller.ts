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

import {
  CreateSizeDto,
  ISizeService,
  SizeServiceTag,
  UpdateSizeDto,
} from '@domain';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
  @Inject(SizeServiceTag)
  private readonly sizesService: ISizeService;

  @Post()
  public async create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  public async findAll() {
    return this.sizesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sizesService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSizeDto: UpdateSizeDto,
  ) {
    return this.sizesService.update(id, updateSizeDto);
  }

  @Delete(':id')
  public async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sizesService.remove(id);
  }
}
