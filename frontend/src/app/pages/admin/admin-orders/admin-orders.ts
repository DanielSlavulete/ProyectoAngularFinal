import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminOrder, AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-orders',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {
  private adminService = inject(AdminService);

  // Signals para manejar el estado reactivo de la tabla de pedidos.
  // orders almacena todos los pedidos reales registrados en Supabase.
  orders = signal<AdminOrder[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Consulta todos los pedidos desde el endpoint de administración.
    // Esta petición está protegida: necesita token JWT y rol ADMIN.
    this.adminService.getOrders().subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando pedidos admin', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los pedidos');
        this.isLoading.set(false);
      }
    });
  }
}