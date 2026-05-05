import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService, AdminUser } from '../../../services/admin';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);

  // Signals para manejar el estado reactivo de la tabla de usuarios.
  // users almacena los usuarios reales obtenidos desde Supabase.
  users = signal<AdminUser[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Llamada al endpoint de administración para consultar todos los usuarios.
    // Esta petición está protegida: requiere token JWT y rol ADMIN.
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando usuarios admin', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los usuarios');
        this.isLoading.set(false);
      }
    });
  }
}