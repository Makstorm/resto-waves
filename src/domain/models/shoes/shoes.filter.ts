import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { randomInt } from 'crypto';

export class ShoeFilter {
  @IsNumber()
  @ApiProperty({ type: Number, example: randomInt(46), required: false })
  public size?: number;
}
