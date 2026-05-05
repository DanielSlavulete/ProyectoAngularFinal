import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../services/admin';

interface AdminStat {
  label: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  // Signals para gestionar el estado reactivo del dashboard.
  // stats contiene las tarjetas de resumen que se pintan en la vista.
  stats = signal<AdminStat[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Consulta las estadísticas generales del panel administrador.
    // Esta petición requiere token JWT y rol ADMIN.
    this.adminService.getStats().subscribe({
      next: (response) => {
        // Convertimos la respuesta del backend en un array preparado para pintarlo
        // fácilmente con @for en el HTML.
        this.stats.set([
          {
            label: 'Usuarios',
            value: String(response.stats.usersCount),
            description: 'Usuarios registrados'
          },
          {
            label: 'Tableros',
            value: String(response.stats.boardsCount),
            description: 'Tableros creados'
          },
          {
            label: 'Notas',
            value: String(response.stats.notesCount),
            description: 'Notas creadas'
          },
          {
            label: 'Pedidos',
            value: String(response.stats.ordersCount),
            description: 'Compras simuladas'
          },
          {
            label: 'Planes activos',
            value: String(response.stats.activePlansCount),
            description: 'Planes disponibles'
          },
          {
            label: 'Ingresos',
            value: `${Number(response.stats.totalRevenue).toFixed(2)} €`,
            description: 'Total simulado'
          }
        ]);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando estadísticas admin', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar las estadísticas');
        this.isLoading.set(false);
      }
    });
  }
}