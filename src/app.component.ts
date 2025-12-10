import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Wine } from './models/wine.model';
import { WineService } from './services/wine.service';
import { AuthService } from './services/auth.service';
import { WineFormComponent } from './components/wine-form/wine-form.component';
import { LoginComponent } from './components/login/login.component';
import { LabelComponent } from './components/label/label.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WineFormComponent, CurrencyPipe, LoginComponent, LabelComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  wineService = inject(WineService);
  authService = inject(AuthService);

  // Expose signals and methods to the template
  isAuthenticated = this.authService.isAuthenticated;
  isGuest = this.authService.isGuest;
  isOperator = this.authService.isOperator;
  isMaster = this.authService.isMaster;
  canWrite = this.authService.canWrite;
  currentUserRole = this.authService.currentUserRole;

  logout() {
    this.authService.logout();
  }

  wines = this.wineService.wines;
  
  selectedWine = signal<Wine | null>(null);
  editingWine = signal<Wine | null>(null);
  labelWine = signal<Wine | null>(null);
  showForm = signal(false);
  showLabel = signal(false);

  viewDetails(wine: Wine) {
    this.selectedWine.set(wine);
  }

  closeDetails() {
    this.selectedWine.set(null);
  }

  openAddForm() {
    if (!this.canWrite()) return;
    this.editingWine.set(null);
    this.showForm.set(true);
  }

  openEditForm(wine: Wine) {
    if (!this.canWrite()) return;
    this.editingWine.set(wine);
    this.showForm.set(true);
  }
  
  openLabel(wine: Wine) {
    this.labelWine.set(wine);
    this.showLabel.set(true);
    this.closeDetails();
  }
  
  closeLabel() {
    this.showLabel.set(false);
    this.labelWine.set(null);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingWine.set(null);
  }

  saveWine(wineData: Omit<Wine, 'id' | 'barcode'>) {
    const wineToUpdate = this.editingWine();
    if (wineToUpdate) {
      this.wineService.updateWine({ ...wineToUpdate, ...wineData });
    } else {
      this.wineService.addWine(wineData);
    }
    this.closeForm();
  }

  deleteWine(event: MouseEvent, wine: Wine) {
    event.stopPropagation();
    if (!this.canWrite()) return;

    if (confirm(`Sei sicuro di voler eliminare ${wine.name}?`)) {
      this.wineService.deleteWine(wine.id);
      if (this.selectedWine()?.id === wine.id) {
        this.closeDetails();
      }
    }
  }
}
