import { Injectable, signal, computed } from '@angular/core';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Hardcoded passwords for demonstration purposes
  private passwords = {
    Master: 'masterpass',
    Operatore: 'operatorpass',
  };

  // State
  currentUserRole = signal<UserRole | null>(null);
  loginError = signal<string | null>(null);

  // Computed Signals for UI logic
  isAuthenticated = computed(() => this.currentUserRole() !== null);
  isMaster = computed(() => this.currentUserRole() === 'Master');
  isOperator = computed(() => this.currentUserRole() === 'Operatore');
  isGuest = computed(() => this.currentUserRole() === 'Ospite');
  canWrite = computed(() => this.isMaster() || this.isOperator());

  /**
   * Attempts to log in a user with a specific role and password.
   * @param role The role to log in as.
   * @param password The password for the role (if required).
   */
  login(role: UserRole, password?: string): void {
    this.loginError.set(null); // Reset error on new attempt

    if (role === 'Ospite') {
      this.currentUserRole.set('Ospite');
      return;
    }

    const expectedPassword = this.passwords[role as keyof typeof this.passwords];
    if (expectedPassword && password === expectedPassword) {
      this.currentUserRole.set(role);
    } else {
      this.loginError.set('Password errata. Riprova.');
    }
  }

  /**
   * Logs out the current user and resets state.
   */
  logout() {
    this.currentUserRole.set(null);
    this.loginError.set(null); // Also clear errors on logout
  }
}
