import { Component, ChangeDetectionStrategy, input, output, effect, ElementRef, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Wine } from '../../models/wine.model';

declare var JsBarcode: any;

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  wine = input.required<Wine | null>();
  close = output<void>();

  // Fix: Renamed `view_child` to `viewChild` to match the correct Angular API.
  barcodeSvg = viewChild<ElementRef>('barcode');

  constructor() {
    effect(() => {
        const wineData = this.wine();
        const barcodeElement = this.barcodeSvg();
        if (wineData && wineData.barcode && barcodeElement) {
            try {
                JsBarcode(barcodeElement.nativeElement, wineData.barcode, {
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 18,
                    lineColor: "#000",
                    width: 2,
                    height: 50,
                    margin: 10
                });
            } catch (e) {
                console.error("Errore nella generazione del barcode:", e);
                barcodeElement.nativeElement.innerHTML = 'Barcode non valido';
            }
        }
    });
  }

  printLabel() {
    window.print();
  }
}
