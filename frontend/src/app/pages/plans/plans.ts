import { Component, inject } from '@angular/core';
import { Cart } from '../../services/cart';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  featureKey: string;
  tag: string;
  benefits: string[];
}

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css'
})
export class Plans {
  private cart = inject(Cart);

  plans: Plan[] = [
    {
      id: 1,
      name: 'Colores Premium',
      description: 'Desbloquea más colores para personalizar tus notas y textos.',
      price: 4.99,
      featureKey: 'PREMIUM_COLORS',
      tag: 'Personalización',
      benefits: [
        'Más colores de fuente',
        'Más colores para notas',
        'Mejor aspecto visual'
      ]
    },
    {
      id: 2,
      name: 'Background Themes',
      description: 'Accede a fondos especiales para tus tableros.',
      price: 6.99,
      featureKey: 'BACKGROUND_THEMES',
      tag: 'Diseño',
      benefits: [
        'Fondos premium',
        'Temas visuales',
        'Más opciones de tablero'
      ]
    },
    {
      id: 3,
      name: 'Más Tableros',
      description: 'Amplía tu límite de tableros de 3 hasta 12.',
      price: 9.99,
      featureKey: 'BOARD_LIMIT_12',
      tag: 'Productividad',
      benefits: [
        'Hasta 12 tableros',
        'Más espacio de trabajo',
        'Ideal para usuarios avanzados'
      ]
    }
  ];

  addToCart(plan: Plan): void {
    this.cart.addItem({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      featureKey: plan.featureKey
    });
  }

  isInCart(planId: number): boolean {
    return this.cart.items().some(item => item.id === planId);
  }
}