import { ApiProperty } from '@nestjs/swagger';
import { randomInt } from 'crypto';

export class CreateShoeDto {
  @ApiProperty({
    type: String,
    description: 'Product model row',
    example: 'Nike Lebron, Jordan',
  })
  public model: string;

  @ApiProperty({
    type: String,
    description: 'Product name',
    example: 'Nike Air Jordan Why Not 6 X Black Metallic Gold DO7189-071',
  })
  public name: string;

  @ApiProperty({
    type: Number,
    description: 'Price for product',
    example: randomInt(5000),
  })
  public price: number;

  @ApiProperty({
    type: String,
    description: 'Vendor code',
    example: randomInt(5000),
  })
  public vendorCode: number;
}
