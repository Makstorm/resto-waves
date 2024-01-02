import {
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

//абстрактна сутність від якої можна в подальщому наслідуватись
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  //сюди можна додати будь які метаданні, ми будемо зберігати помітку для згенерованих сутностей
  @Column({ type: 'jsonb', default: {} })
  public metadata: any;
}
