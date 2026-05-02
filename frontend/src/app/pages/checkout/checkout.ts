import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private fb = inject(FormBuilder);
  cart = inject(Cart);

  purchaseCompleted = signal(false);

  checkoutForm = this.fb.group({
    cardHolder: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
  });

  onSubmit(): void {
    if (this.cart.items().length === 0) {
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    console.log('Compra simulada completada:', {
      items: this.cart.items(),
      total: this.cart.totalPrice(),
      payment: this.checkoutForm.value
    });

    this.cart.clearCart();
    this.purchaseCompleted.set(true);
    this.checkoutForm.reset();
  }
}