import { CreateShoeDto, ShoesEntity, UpdateShoeDto } from '@domain';

export interface IShoesService {
  create(dto: CreateShoeDto): Promise<ShoesEntity>;
  findAll(): Promise<ShoesEntity[]>;
  findOne(id: string): Promise<ShoesEntity>;
  findBySize(size: number): Promise<ShoesEntity[]>;
  update(id: string, dto: UpdateShoeDto): Promise<ShoesEntity>;
  remove(id: string): Promise<ShoesEntity>;
  compareWithDatabase(): Promise<void>;
}
