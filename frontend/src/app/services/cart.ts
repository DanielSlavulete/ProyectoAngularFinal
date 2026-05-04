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
  private readonly storageKey = 'cart';

  private itemsSignal = signal<CartItem[]>(this.getStoredCart());

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

    const updatedItems = [
      ...currentItems,
      {
        ...item,
        quantity: 1
      }
    ];

    this.setItems(updatedItems);
  }

  removeItem(planId: number): void {
    const updatedItems = this.itemsSignal().filter(item => item.id !== planId);
    this.setItems(updatedItems);
  }

  clearCart(): void {
    this.setItems([]);
  }

  private setItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private getStoredCart(): CartItem[] {
    const storedCart = localStorage.getItem(this.storageKey);

    if (!storedCart) {
      return [];
    }

    return JSON.parse(storedCart);
  }
}