import { CreateSizeDto, SizeEntity, UpdateSizeDto } from '@domain';

export interface ISizeService {
  create(dto: CreateSizeDto): Promise<SizeEntity>;
  findAll(): Promise<SizeEntity[]>;
  findOne(id: string): Promise<SizeEntity>;
  findOneBySize(size: number): Promise<SizeEntity>;
  update(id: string, dto: UpdateSizeDto): Promise<SizeEntity>;
  remove(id: string): Promise<SizeEntity>;
}
