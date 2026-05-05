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

  // Formulario reactivo con validaciones básicas antes de enviar datos al backend.
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit(): void {
    // Si el formulario no cumple las validaciones, marcamos los campos como tocados
    // para mostrar los mensajes de error en la vista.
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.registerForm.getRawValue();

    // Validación específica del frontend para comprobar que ambas contraseñas coinciden.
    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      this.registerForm.get('confirmPassword')?.markAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    // Registro real contra el backend.
    // Si se crea el usuario correctamente, el backend devuelve usuario + token JWT.
    this.auth.register({
      name: name!,
      email: email!,
      password: password!
    }).subscribe({
      next: (response) => {
        // Guardamos la sesión: token en localStorage y usuario en el servicio Auth.
        this.auth.saveSession(response);

        // Después del registro, el usuario entra directamente a la zona privada.
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo crear la cuenta';
        this.isLoading = false;
      }
    });
  }
}