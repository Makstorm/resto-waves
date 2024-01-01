import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ShoesEntity,
  CreateShoeDto,
  UpdateShoeDto,
  IShoesService,
} from '@domain';

@Injectable()
export class ShoesService implements IShoesService {
  @InjectRepository(ShoesEntity)
  private readonly repository: Repository<ShoesEntity>;

  public async create(dto: CreateShoeDto): Promise<ShoesEntity> {
    const newShoes = await this.repository.create({ ...dto });
    await this.repository.save(newShoes);
    return newShoes;
  }

  public async findAll(): Promise<ShoesEntity[]> {
    return await this.repository.find();
  }

  public async findOne(id: string): Promise<ShoesEntity> {
    const shoes = this.repository.findOneBy({ id });
    if (!shoes) {
      throw new NotFoundException(`Shoes with id: ${id} does not exist`);
    }
    return shoes;
  }

  public async update(id: string, dto: UpdateShoeDto): Promise<ShoesEntity> {
    await this.repository.update({ id }, { ...dto });
    return await this.findOne(id);
  }

  public async remove(id: string): Promise<ShoesEntity> {
    const shoesForDelete = await this.findOne(id);
    return this.repository.remove(shoesForDelete);
  }
}
