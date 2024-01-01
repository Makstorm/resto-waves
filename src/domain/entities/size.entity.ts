import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ShoesEntity } from './shoe.entity';

@Entity('sizes')
export class SizeEntity extends AbstractEntity {
  @Column()
  public size: number;

  @ManyToMany(() => ShoesEntity, (shoes) => shoes.sizes, { cascade: true })
  public shoes: ShoesEntity[];
}
