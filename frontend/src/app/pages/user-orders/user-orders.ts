import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface UserOrder {
  id: number;
  createdAt: string;
  status: 'PAID';
  paymentMethod: 'CARD';
  total: number;
  items: {
    name: string;
    featureKey: string;
    price: number;
  }[];
}

@Component({
  selector: 'app-user-orders',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css'
})
export class UserOrders {
  orders: UserOrder[] = [
    {
      id: 1,
      createdAt: '02/05/2026',
      status: 'PAID',
      paymentMethod: 'CARD',
      total: 11.98,
      items: [
        {
          name: 'Colores Premium',
          featureKey: 'PREMIUM_COLORS',
          price: 4.99
        },
        {
          name: 'Background Themes',
          featureKey: 'BACKGROUND_THEMES',
          price: 6.99
        }
      ]
    },
    {
      id: 2,
      createdAt: '04/05/2026',
      status: 'PAID',
      paymentMethod: 'CARD',
      total: 9.99,
      items: [
        {
          name: 'Más Tableros',
          featureKey: 'BOARD_LIMIT_12',
          price: 9.99
        }
      ]
    }
  ];
}