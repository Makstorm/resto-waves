export interface EntitySheetsItem {
  [key: string]: string;
}

export interface IShoesTextData {
  name: string;
  price: number;
  vendor_code: number;
}

export type IShoes = IShoesTextData & { sizes: number[]; title?: string };

export type IGoogleSheetsResponse = IShoes[];
