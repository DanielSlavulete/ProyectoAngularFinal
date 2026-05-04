import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const { email, password } = this.loginForm.getRawValue();

    this.auth.login({
      email: email!,
      password: password!
    }).subscribe({
      next: (response) => {
        this.auth.saveSession(response);

        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo iniciar sesión';
        this.isLoading = false;
      }
    });
  }
}