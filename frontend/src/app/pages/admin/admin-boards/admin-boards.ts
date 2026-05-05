import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminBoard, AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-boards',
  imports: [DatePipe],
  templateUrl: './admin-boards.html',
  styleUrl: './admin-boards.css'
})
export class AdminBoards implements OnInit {
  private adminService = inject(AdminService);

  // Signals para gestionar el estado reactivo de la tabla de tableros.
  // boards almacena todos los tableros reales creados por los usuarios.
  boards = signal<AdminBoard[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadBoards();
  }

  loadBoards(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Consulta todos los tableros desde el endpoint de administración.
    // Esta petición está protegida: necesita token JWT y rol ADMIN.
    this.adminService.getBoards().subscribe({
      next: (response) => {
        this.boards.set(response.boards);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando tableros admin', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los tableros');
        this.isLoading.set(false);
      }
    });
  }
}