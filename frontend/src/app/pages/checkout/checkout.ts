import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cart } from '../../services/cart';
import { OrderService, Order } from '../../services/order';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);

  // Servicio global del carrito. Mantiene los planes seleccionados y el total.
  cart = inject(Cart);

  // Signals para controlar el estado visual del checkout.
  // purchaseCompleted muestra la pantalla de éxito.
  // createdOrder guarda el pedido devuelto por el backend.
  purchaseCompleted = signal(false);
  isProcessing = signal(false);
  errorMessage = signal('');
  createdOrder = signal<Order | null>(null);

  // Formulario reactivo de pago simulado.
  // No procesa pagos reales, solo valida formato básico de datos ficticios.
  checkoutForm = this.fb.group({
    cardHolder: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
  });

  onSubmit(): void {
    // No permitimos continuar si el carrito está vacío.
    if (this.cart.items().length === 0) {
      return;
    }

    // Si el formulario no es válido, mostramos los errores en la vista.
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    // Transformamos los items del carrito al formato que espera el backend.
    // El backend recalcula precios usando Supabase, no se fía del precio enviado desde Angular.
    const orderItems = this.cart.items().map(item => ({
      planId: item.id,
      quantity: item.quantity
    }));

    // Crea el pedido real en backend:
    // orders, order_items y user_plans.
    // El token JWT se envía automáticamente mediante el interceptor.
    this.orderService.createOrder({
      items: orderItems,
      paymentMethod: 'CARD'
    }).subscribe({
      next: (response) => {
        // Guardamos el pedido creado para mostrar el número y total en pantalla.
        this.createdOrder.set(response.order);

        // Al completarse el pedido, vaciamos el carrito local.
        this.cart.clearCart();

        this.purchaseCompleted.set(true);
        this.checkoutForm.reset();
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('Error creando pedido', error);
        this.errorMessage.set(error.error?.message || 'No se pudo completar el pedido');
        this.isProcessing.set(false);
      }
    });
  }
}