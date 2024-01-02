import {
  EntitySheetsItem,
  IGoogleSheetsResponse,
  IShoes,
  IShoesTextData,
  SpreadSheetTag,
} from '@domain';
import { Inject, Injectable } from '@nestjs/common';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

@Injectable()
export class GoogleService {
  constructor(@Inject(SpreadSheetTag) private spreadsheet: GoogleSpreadsheet) {}

  public async getAllData(): Promise<IGoogleSheetsResponse> {
    const sheets = this.spreadsheet.sheetsByIndex;

    const shoesPromise = sheets.map(async (el) => await this.getData(el));

    const shoes = await Promise.all(shoesPromise);

    const response = shoes.flat(2);

    // console.log(response);

    return response;
  }

  public async getData(sheet: GoogleSpreadsheetWorksheet): Promise<IShoes[]> {
    // geting cells with stable text data

    const propertyValues: [][] = await sheet.getCellsInRange('B4:$6');
    const mockTitles = ['name', 'price', 'vendor_code'];
    // const propertyTitles = headersText.flat();

    //getting unstable size information

    const sizeHeaders = await sheet.getCellsInRange('A8:A18');
    const sizeData: string[][] = await sheet.getCellsInRange('B8:$18');

    const populatedSizeData = this.populateArrays(
      sizeData,
      propertyValues[0].length,
    );

    const sortedValues = this.sortEntities(
      [...propertyValues],
      [...mockTitles],
    );

    const sortedSizes = this.sortEntities(
      [...populatedSizeData],
      [...sizeHeaders],
    );

    const sortedSizeNumbers = this.converSizesToNumbers(sortedSizes);

    const entities = this.formEntities(
      this.convertToIShoesTextData(sortedValues),
      sortedSizeNumbers,
      sheet.title,
    );

    return entities;
  }

  private populateArrays(arr: any[][], size: number): any[][] {
    for (let i = 0; i < arr.length; i++) {
      const nestedArray = arr[i];
      const diff = size - nestedArray.length;

      if (diff > 0) {
        for (let j = 0; j < diff; j++) {
          nestedArray.push('');
        }
      }
    }
    return arr;
  }

  private sortEntities(
    propertyValues: string[][],
    mockTitles: string[],
  ): EntitySheetsItem[] {
    const entities: EntitySheetsItem[] = [];

    for (let i = 0; i < propertyValues[0].length; i++) {
      const entity: EntitySheetsItem = {};
      for (let j = 0; j < mockTitles.length; j++) {
        entity[mockTitles[j]] = propertyValues[j][i];
      }
      entities.push(entity);
    }

    return entities;
  }

  private converSizesToNumbers(array: Record<string, string>[]): number[][] {
    const resultArrayOfArrays: number[][] = [];

    for (const obj of array) {
      const result: number[] = [];

      for (const key in obj) {
        if (
          Object.prototype.hasOwnProperty.call(obj, key) &&
          obj[key] === '+'
        ) {
          result.push(parseInt(key, 10));
        }
      }

      resultArrayOfArrays.push(result);
    }

    return resultArrayOfArrays;
  }

  private formEntities(
    products: IShoesTextData[],
    sizes: number[][],
    title: string,
  ): IShoes[] {
    if (products.length === sizes.length) {
      const productsWithSizes = products.map((product, index) => {
        return {
          ...product,
          sizes: sizes[index],
          title,
        };
      });

      return productsWithSizes;
    } else {
      console.log(
        'Кількість продуктів не відповідає кількості масивів розмірів',
      );
    }
  }

  private convertToIShoesTextData(
    entities: EntitySheetsItem[],
  ): IShoesTextData[] {
    const convertedData: IShoesTextData[] = [];

    for (const entity of entities) {
      const { name, price, vendor_code } = entity;
      const convertedItem: IShoesTextData = {
        name: name || '',
        price: Number(price) || 0,
        vendor_code: Number(vendor_code) || 0,
      };

      convertedData.push(convertedItem);
    }

    return convertedData;
  }
}
