import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      this.registerForm.get('confirmPassword')?.markAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.auth.register({
      name: name!,
      email: email!,
      password: password!
    }).subscribe({
      next: (response) => {
        this.auth.saveSession(response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo crear la cuenta';
        this.isLoading = false;
      }
    });
  }
}