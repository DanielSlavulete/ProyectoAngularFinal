import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

interface AdminOrder {
  id: number;
  user: string;
  email: string;
  total: number;
  status: 'PAID';
  paymentMethod: 'CARD';
  itemsCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-orders',
  imports: [CurrencyPipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders {
  orders: AdminOrder[] = [
    {
      id: 1,
      user: 'Daniel Slavulete',
      email: 'daniel@test.com',
      total: 11.98,
      status: 'PAID',
      paymentMethod: 'CARD',
      itemsCount: 2,
      createdAt: '02/05/2026'
    },
    {
      id: 2,
      user: 'Laura Pérez',
      email: 'laura@test.com',
      total: 9.99,
      status: 'PAID',
      paymentMethod: 'CARD',
      itemsCount: 1,
      createdAt: '03/05/2026'
    },
    {
      id: 3,
      user: 'Admin Test',
      email: 'admin@test.com',
      total: 4.99,
      status: 'PAID',
      paymentMethod: 'CARD',
      itemsCount: 1,
      createdAt: '04/05/2026'
    }
  ];
}