import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  ShoesEntity,
  CreateShoeDto,
  UpdateShoeDto,
  IShoesService,
  GoogleServiceTag,
  SizeServiceTag,
  ISizeService,
  ShoesSizeEntity,
  IGoogleSheetsResponse,
} from '@domain';
import { GoogleService } from '../google/google.service';

@Injectable()
export class ShoesService implements IShoesService {
  // compareWithDatabase(): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }
  @InjectRepository(ShoesEntity)
  private readonly repository: Repository<ShoesEntity>;
  @InjectRepository(ShoesSizeEntity)
  private readonly shoesSizeRepository: Repository<ShoesSizeEntity>;

  @Inject(GoogleServiceTag) private readonly googleService: GoogleService;

  @Inject(SizeServiceTag) private readonly sizeService: ISizeService;

  public async create(dto: CreateShoeDto): Promise<ShoesEntity> {
    const newShoes = await this.repository.create({ ...dto });
    const savedEntity = await this.repository.save(newShoes);

    const sizeEntity = await this.sizeService.findAll();

    console.log(sizeEntity);

    const newShoesSize = this.shoesSizeRepository.create({
      shoeId: savedEntity.id,
      sizeId: sizeEntity[0].id,
    });

    await this.shoesSizeRepository.save(newShoesSize);

    return newShoes;
  }

  public async findAll(): Promise<ShoesEntity[]> {
    return await this.repository.find({ relations: ['sizes'] });
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

  public async compareWithDatabase(): Promise<void> {
    try {
      // Отримання даних з бази даних та Google таблиці
      const shoesFromDB = await this.repository.find({
        where: { metadata: { generated: true } },
        relations: ['sizes'],
      });

      const dataFromGoogleTable = await this.googleService.getAllData();

      // Порівняння отриманих даних з бази з отриманими з Google таблиці
      // Додавання нових сутностей та видалення з бд видалених з таблиці
      await this.compareShoesPresence(shoesFromDB, dataFromGoogleTable);

      //На цьому етапі сутності з таблиці та в бд маютьбути ідентичні, але ще необхідно звірити існуючі розміри
      await this.compareProductSizes(dataFromGoogleTable);
    } catch (error) {
      console.error('Помилка порівняння з базою даних:', error);
      throw error;
    }
  }

  private async compareShoesPresence(
    shoesFromDb: ShoesEntity[],
    dataFromGoogleTable: IGoogleSheetsResponse,
  ) {
    //На випадок, якщо з таблиці були зовсім видалені деякі товари,
    //то розділяжмо наші сутності на ті що треба буде видалити,
    //і ті що будуть перевірятись далі
    const matchingEntities = shoesFromDb.filter((entity) =>
      dataFromGoogleTable.find((obj) => obj.name === entity.name),
    );
    const nonMatchingEntities = shoesFromDb.filter(
      (entity) => !dataFromGoogleTable.find((obj) => obj.name === entity.name),
    );

    //видаляємо надлишкові сутності
    await this.repository.remove(nonMatchingEntities);

    //йде перевірка сутностей що залищились
    for (const googleData of dataFromGoogleTable) {
      const matchedShoe = matchingEntities.find((shoe) => {
        return (
          shoe.name === googleData.name &&
          shoe.price === googleData.price &&
          shoe.vendorCode === googleData.vendor_code &&
          shoe.model === googleData.title
        );
      });

      //Якщо в в таблицю додалт якийсь товар якого до цього не було в бд то створюємо нову сутність
      if (!matchedShoe) {
        const newShoes = await this.repository.create({
          name: googleData.name,
          price: googleData.price,
          vendorCode: googleData.vendor_code,
          model: googleData.title,
          metadata: { generated: true },
        });

        await this.repository.save(newShoes);

        console.log('Iteration ended with new Shoes entity');

        continue;
      }

      console.log('Iteration ended with no changes');
    }
  }

  private async compareProductSizes(
    dataFromGoogleTable: IGoogleSheetsResponse,
  ) {
    //Отримуємо звірений з таблицею список товарів з бд
    const shoesFromDB = await this.repository.find({
      where: { metadata: { generated: true } },
      relations: ['sizes'],
    });

    //Проходимо по ним товарам, щоб синхронізувати розміри
    for (const shoes of shoesFromDB) {
      //Відповідний до ітерацї товар з таблиці
      const matchingGoogleTableObj = dataFromGoogleTable.find(
        (obj) => obj.name === shoes.name,
      );

      //співпавщі розміри
      const matchingSizeEntities = shoes.sizes.filter((entity) =>
        matchingGoogleTableObj.sizes.includes(entity.size),
      );

      //відмінні розміри
      const nonMatchingSizeEntitiesIds = shoes.sizes
        .filter((entity) => !matchingGoogleTableObj.sizes.includes(entity.size))
        .map((entity) => entity.id);

      const nonMachedRelations = await this.shoesSizeRepository.find({
        where: { sizeId: In(nonMatchingSizeEntitiesIds), shoeId: shoes.id },
      });

      //видалення відмінних розімірів
      await this.shoesSizeRepository.remove(nonMachedRelations);

      //отримуємо список розмірів що треба додати
      const shoeSizesEntitiesPromises = matchingGoogleTableObj.sizes.map(
        async (size) => {
          const foundSize = matchingSizeEntities.find(
            (sizeEntity) => sizeEntity.size === size,
          );

          if (!foundSize) {
            const foundSizeEntity = await this.sizeService.findOneBySize(size);

            const newShoeSizeEntity = new ShoesSizeEntity();

            newShoeSizeEntity.shoeId = shoes.id;

            if (!foundSizeEntity) {
              const newSize = await this.sizeService.create({ size: size });

              newShoeSizeEntity.sizeId = newSize.id;

              return newShoeSizeEntity;
            }

            newShoeSizeEntity.sizeId = foundSizeEntity.id;

            return newShoeSizeEntity;
          }
        },
      );

      //Зберігаємо нові розміри
      const shoesSizesEntities = await Promise.all(shoeSizesEntitiesPromises);

      const filteredShoeSizesEntities = shoesSizesEntities.filter(
        (el) => el !== undefined,
      );

      if (filteredShoeSizesEntities.length !== 0) {
        await this.shoesSizeRepository.save(shoesSizesEntities);
      }
    }

    console.log('Done');
  }
}
