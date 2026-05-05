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

  // Formulario reactivo para iniciar sesión.
  // Validamos que el email tenga formato correcto y que la contraseña no esté vacía.
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    // Si el formulario no es válido, marcamos los campos para mostrar errores en el HTML.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const { email, password } = this.loginForm.getRawValue();

    // Login real contra el backend.
    // Si las credenciales son correctas, el backend devuelve usuario + token JWT.
    this.auth.login({
      email: email!,
      password: password!
    }).subscribe({
      next: (response) => {
        // Guardamos sesión en localstorage junto a token y datos basicos:
        this.auth.saveSession(response);

        // Redirigimos según el rol
        // Si es ADMIN entra al panel, si no entra a home
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