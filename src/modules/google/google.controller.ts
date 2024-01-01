import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GoogleServiceTag } from '@domain';
import { GoogleService } from './google.service';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  @Inject(GoogleServiceTag) private readonly service: GoogleService;

  @Get()
  public async getSheet() {
    await this.service.getAllData();
  }
}
