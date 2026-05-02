import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  featureKey: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private itemsSignal = signal<CartItem[]>([]);

  items = this.itemsSignal.asReadonly();

  totalItems = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.price * item.quantity, 0)
  );

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const currentItems = this.itemsSignal();

    const existingItem = currentItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      return;
    }

    this.itemsSignal.set([
      ...currentItems,
      {
        ...item,
        quantity: 1
      }
    ]);
  }

  removeItem(planId: number): void {
    this.itemsSignal.set(
      this.itemsSignal().filter(item => item.id !== planId)
    );
  }

  clearCart(): void {
    this.itemsSignal.set([]);
  }
}