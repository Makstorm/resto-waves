import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { SizeEntity } from './size.entity';

@Entity('shoes')
export class ShoesEntity extends AbstractEntity {
  @Column()
  public model: string;

  @Column()
  public name: string;

  @Column()
  public price: number;

  @Column()
  public vendorCode: number;

  @ManyToMany(() => SizeEntity, (size) => size.shoes, { cascade: true })
  @JoinTable({
    name: 'shoes_size',
    joinColumn: {
      name: 'shoeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'sizeId',
      referencedColumnName: 'id',
    },
  })
  public sizes: SizeEntity[];
}
