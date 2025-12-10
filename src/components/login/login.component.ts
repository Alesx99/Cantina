import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  selectedRole = signal<UserRole | null>(null);
  loginError = this.authService.loginError;

  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  selectRole(role: UserRole) {
    if (role === 'Ospite') {
      // Log in guest directly
      this.authService.login('Ospite');
    } else {
      // Show password form for other roles
      this.selectedRole.set(role);
      this.authService.loginError.set(null); // Clear previous errors
    }
  }

  attemptLogin() {
    if (this.passwordForm.invalid) {
      return;
    }
    const role = this.selectedRole();
    if (role && role !== 'Ospite') {
      this.authService.login(role, this.passwordForm.value.password);
    }
  }

  goBack() {
    this.selectedRole.set(null);
    this.passwordForm.reset();
  }
}
