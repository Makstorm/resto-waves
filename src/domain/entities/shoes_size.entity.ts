import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShoesEntity } from './shoe.entity';
import { SizeEntity } from './size.entity';

@Entity({ name: 'shoes_size' })
export class ShoesSizeEntity {
  @PrimaryColumn('uuid')
  @ManyToOne(() => ShoesEntity, (shoes) => shoes.id)
  public shoeId: string;

  @PrimaryColumn('uuid')
  @ManyToOne(() => SizeEntity, (size) => size.id)
  public sizeId: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
