import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order, OrderService } from '../../services/order';

@Component({
  selector: 'app-user-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css'
})
export class UserOrders implements OnInit {
  private orderService = inject(OrderService);

  // Signals para gestionar el estado reactivo de la vista:
  // pedidos cargados, estado de carga y posibles errores.
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Llamada al backend para obtener los pedidos del usuario logueado.
    // El token JWT se añade automáticamente mediante el interceptor.
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders.set(response.orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando pedidos', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los pedidos');
        this.isLoading.set(false);
      }
    });
  }
}