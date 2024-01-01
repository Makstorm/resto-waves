import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';

export class CreateSizeDto {
  @ApiProperty({
    type: Number,
    description: 'Size value',
    example: randomInt(47),
  })
  public size: number;
}
