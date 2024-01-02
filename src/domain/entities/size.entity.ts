import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ShoesEntity } from './shoe.entity';

//Данні про різміри можна було зберігати і у вигляді простого рядка json, але для маштабованості краще зберігати розміри у окремій таблиці, і додавати їх за звʼязком
@Entity('sizes')
export class SizeEntity extends AbstractEntity {
  @Column({ unique: true })
  public size: number;

  @ManyToMany(() => ShoesEntity, (shoes) => shoes.sizes)
  public shoes: ShoesEntity[];
}
