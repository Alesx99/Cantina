import { Component, ChangeDetectionStrategy, input, output, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Wine } from '../../models/wine.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wine-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './wine-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class WineFormComponent {
  wine = input<Wine | null>(null);
  
  save = output<Omit<Wine, 'id' | 'barcode'>>();
  cancel = output<void>();

  private authService = inject(AuthService);
  isMaster = this.authService.isMaster;

  wineForm: FormGroup;
  imagePreview = '';

  constructor(private fb: FormBuilder) {
    this.wineForm = this.fb.group({
      name: ['', Validators.required],
      winery: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]],
      type: ['Rosso', Validators.required],
      labelImage: [''],
      pricePurchase: [0, [Validators.min(0)]],
      priceRetail: [0, [Validators.min(0)]],
      priceWholesale: [0, [Validators.min(0)]],
    });

    // Effect to patch form when wine input changes
    effect(() => {
        const wineToEdit = this.wine();
        if (wineToEdit) {
            this.wineForm.patchValue(wineToEdit);
            if (wineToEdit.labelImage) {
                this.imagePreview = wineToEdit.labelImage;
            }
        } else {
            this.wineForm.reset({ year: new Date().getFullYear(), type: 'Rosso', pricePurchase: 0, priceRetail: 0, priceWholesale: 0 });
            this.imagePreview = '';
        }
    });

    // Effect to manage form control state based on user role
    effect(() => {
        const isMaster = this.isMaster();
        const pricePurchaseControl = this.wineForm.get('pricePurchase');
        if (pricePurchaseControl) {
            if (isMaster) {
                pricePurchaseControl.enable();
            } else {
                pricePurchaseControl.disable();
            }
        }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.wineForm.patchValue({ labelImage: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.wineForm.valid) {
      this.save.emit(this.wineForm.getRawValue());
    }
  }

  onEscape() {
    this.cancel.emit();
  }
}