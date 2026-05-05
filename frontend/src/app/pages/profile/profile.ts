import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPlan, UserProfile, UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private userService = inject(UserService);

  // Signals que almacenan el estado reactivo del perfil.
  // user guarda los datos reales del usuario logueado.
  // activePlans guarda los planes comprados por ese usuario.
  user = signal<UserProfile | null>(null);
  activePlans = signal<UserPlan[]>([]);

  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadProfile();
    this.loadPlans();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Carga el perfil real desde el backend.
    // El token JWT se envía automáticamente gracias al interceptor.
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando perfil', error);
        this.errorMessage.set(error.error?.message || 'No se pudo cargar el perfil');
        this.isLoading.set(false);
      }
    });
  }

  loadPlans(): void {
    // Carga los planes activos/comprados del usuario desde user_plans.
    // También usa el token JWT para identificar al usuario logueado.
    this.userService.getMyPlans().subscribe({
      next: (response) => {
        this.activePlans.set(response.plans);
      },
      error: (error) => {
        console.error('Error cargando planes activos', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los planes activos');
      }
    });
  }

  // Devuelve la inicial del usuario para mostrarla en el avatar
  // cuando no hay una imagen personalizada.
  getInitial(): string {
    return this.user()?.name.charAt(0).toUpperCase() || '?';
  }
}