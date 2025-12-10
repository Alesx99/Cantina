

import { Injectable, signal, computed, inject } from '@angular/core';
import { Wine } from '../models/wine.model';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  private _wines = signal<Wine[]>([]);

  public readonly wines = this._wines.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Some mock data to start with, including new price fields
    const initialWines: Wine[] = [
      {
        id: 1,
        name: 'Barolo',
        year: 2018,
        winery: 'Tenuta del Piemonte',
        type: 'Rosso',
        pricePurchase: 35.50,
        priceRetail: 79.99,
        priceWholesale: 55.00,
        barcode: '1721259600001',
        labelImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTUwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzgwMDAwMCIvPjx0ZXh0IHg9IjUwIiB5PSI0MCIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRkZGRDE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZW51dGEgZGVsIFBpZW1vbnRlPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI4MyIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjM1IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkJhcm9sbzwvdGV4dD48dGV4dCB4PSI1MCIgeT0iMTMwIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc2lpemU9IjE2IiBmaWxsPSIjRkZGRDE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yMDE4PC90ZXh0Pjwvc3ZnPg=='
      },
      {
        id: 2,
        name: 'Vermentino di Sardegna',
        year: 2022,
        winery: 'Vigne Sarde',
        type: 'Bianco',
        pricePurchase: 12.00,
        priceRetail: 29.50,
        priceWholesale: 20.00,
        barcode: '1721259600002',
        labelImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTUwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGRkZFRSIvPjx0ZXh0IHg9IjUwIiB5PSI0MCIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjA2MDYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5WZXJtZW50aW5vPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI4MyIgZm9udC1mYW1pbHk9InNjcmlwdCIgZm9udC1zaXplPSIzMiIgZmlsbD0iI0REQzEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+ZGkgU2FyZGVnbmE8L3RleHQ+PHRleHQgeD0iNTAiIHk9IjEzMCIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjA2MDYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yMDIyPC90ZXh0Pjwvc3ZnPg=='
      },
    ];
    this._wines.set(initialWines);
  }

  addWine(wine: Omit<Wine, 'id' | 'barcode'>) {
    const newWine: Wine = {
      ...wine,
      id: Date.now(),
      barcode: Date.now().toString(),
    };
    this._wines.update(wines => [...wines, newWine]);
  }

  updateWine(updatedWine: Wine) {
    this._wines.update(wines =>
      wines.map(wine => (wine.id === updatedWine.id ? updatedWine : wine))
    );
  }

  deleteWine(id: number) {
    this._wines.update(wines => wines.filter(wine => wine.id !== id));
  }
  
}