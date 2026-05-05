import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminPlan, AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-plans',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './admin-plans.html',
  styleUrl: './admin-plans.css'
})
export class AdminPlans implements OnInit {
  private adminService = inject(AdminService);

  // Signals para controlar el estado reactivo de la vista.
  // plans guarda los planes reales obtenidos desde Supabase.
  plans = signal<AdminPlan[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Consulta los planes desde el endpoint de administración.
    // Esta petición requiere token JWT y rol ADMIN.
    this.adminService.getPlans().subscribe({
      next: (response) => {
        this.plans.set(response.plans);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando planes admin', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los planes');
        this.isLoading.set(false);
      }
    });
  }
}