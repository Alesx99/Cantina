export interface Wine {
  id: number;
  name: string;
  year: number;
  winery: string;
  type: 'Rosso' | 'Bianco' | 'Rosato' | 'Frizzante';
  labelImage?: string; // base64 string
  pricePurchase?: number; // "Acquisto"
  priceRetail?: number; // "Enoteca"
  priceWholesale?: number; // "Ingrosso"
  barcode?: string;
}