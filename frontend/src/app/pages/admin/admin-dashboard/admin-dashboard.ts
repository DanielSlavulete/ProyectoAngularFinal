import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

interface AdminStat {
  label: string;
  value: string;
  description: string;
}

interface RecentOrder {
  id: number;
  user: string;
  total: number;
  status: 'PAID';
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  stats: AdminStat[] = [
    {
      label: 'Usuarios',
      value: '24',
      description: 'Usuarios registrados'
    },
    {
      label: 'Tableros',
      value: '68',
      description: 'Tableros creados'
    },
    {
      label: 'Pedidos',
      value: '17',
      description: 'Compras simuladas'
    },
    {
      label: 'Ingresos',
      value: '129,83 €',
      description: 'Total simulado'
    }
  ];

  recentOrders: RecentOrder[] = [
    {
      id: 1,
      user: 'Daniel Slavulete',
      total: 11.98,
      status: 'PAID',
      createdAt: '02/05/2026'
    },
    {
      id: 2,
      user: 'Laura Pérez',
      total: 9.99,
      status: 'PAID',
      createdAt: '03/05/2026'
    },
    {
      id: 3,
      user: 'Admin Test',
      total: 4.99,
      status: 'PAID',
      createdAt: '04/05/2026'
    }
  ];

  popularPlans = [
    {
      name: 'Colores Premium',
      purchases: 8
    },
    {
      name: 'Background Themes',
      purchases: 5
    },
    {
      name: 'Más Tableros',
      purchases: 4
    }
  ];
}