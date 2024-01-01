import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from '../../domain/models/size/create-size.dto';
import { UpdateSizeDto } from '../../domain/models/size/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ISizeService, SizeEntity } from '@domain';
import { Repository } from 'typeorm';

@Injectable()
export class SizesService implements ISizeService {
  @InjectRepository(SizeEntity)
  private readonly repository: Repository<SizeEntity>;

  public async create(dto: CreateSizeDto): Promise<SizeEntity> {
    const newSize = await this.repository.create({ ...dto });
    await this.repository.save(newSize);
    return newSize;
  }

  public async findAll(): Promise<SizeEntity[]> {
    return await this.repository.find();
  }

  public async findOne(id: string): Promise<SizeEntity> {
    const size = this.repository.findOneBy({ id });
    if (!size) {
      throw new NotFoundException(`Size with id: ${id} does not exist`);
    }
    return size;
  }

  public async update(id: string, dto: UpdateSizeDto): Promise<SizeEntity> {
    await this.repository.update({ id }, { ...dto });
    return await this.findOne(id);
  }

  public async remove(id: string): Promise<SizeEntity> {
    const sizeForDelete = await this.findOne(id);
    return this.repository.remove(sizeForDelete);
  }
}
