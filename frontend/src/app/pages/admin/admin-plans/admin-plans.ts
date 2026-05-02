import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

interface AdminPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  featureKey: string;
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin-plans',
  imports: [CurrencyPipe],
  templateUrl: './admin-plans.html',
  styleUrl: './admin-plans.css'
})
export class AdminPlans {
  plans: AdminPlan[] = [
    {
      id: 1,
      name: 'Colores Premium',
      description: 'Desbloquea más colores para personalizar notas y textos.',
      price: 4.99,
      featureKey: 'PREMIUM_COLORS',
      isActive: true,
      createdAt: '02/05/2026'
    },
    {
      id: 2,
      name: 'Background Themes',
      description: 'Permite usar fondos premium en los tableros.',
      price: 6.99,
      featureKey: 'BACKGROUND_THEMES',
      isActive: true,
      createdAt: '02/05/2026'
    },
    {
      id: 3,
      name: 'Más Tableros',
      description: 'Amplía el límite de tableros de 3 hasta 12.',
      price: 9.99,
      featureKey: 'BOARD_LIMIT_12',
      isActive: true,
      createdAt: '02/05/2026'
    }
  ];
}