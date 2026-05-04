import { Component, inject, OnInit, signal } from '@angular/core';
import { Cart } from '../../services/cart';
import { PlanService, Plan } from '../../services/plan';

interface PlanView extends Plan {
  tag: string;
  benefits: string[];
}

@Component({
  selector: 'app-plans',
  imports: [],
  templateUrl: './plans.html',
  styleUrl: './plans.css'
})
export class Plans implements OnInit {
  private cart = inject(Cart);
  private planService = inject(PlanService);

  plans = signal<PlanView[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.planService.getPlans().subscribe({
      next: (response) => {
        const plansWithViewData = response.plans.map(plan => ({
          ...plan,
          tag: this.getPlanTag(plan.feature_key),
          benefits: this.getPlanBenefits(plan.feature_key)
        }));

        this.plans.set(plansWithViewData);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando planes', error);
        this.errorMessage.set(error.error?.message || 'No se pudieron cargar los planes');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(plan: PlanView): void {
    this.cart.addItem({
      id: Number(plan.id),
      name: plan.name,
      price: Number(plan.price),
      featureKey: plan.feature_key
    });
  }

  isInCart(planId: string): boolean {
    return this.cart.items().some(item => item.id === Number(planId));
  }

  private getPlanTag(featureKey: string): string {
    const tags: Record<string, string> = {
      PREMIUM_COLORS: 'Personalización',
      BACKGROUND_THEMES: 'Diseño',
      BOARD_LIMIT_12: 'Productividad'
    };

    return tags[featureKey] || 'Extra';
  }

  private getPlanBenefits(featureKey: string): string[] {
    const benefits: Record<string, string[]> = {
      PREMIUM_COLORS: [
        'Más colores de fuente',
        'Más colores para notas',
        'Mejor aspecto visual'
      ],
      BACKGROUND_THEMES: [
        'Fondos premium',
        'Temas visuales',
        'Más opciones de tablero'
      ],
      BOARD_LIMIT_12: [
        'Hasta 12 tableros',
        'Más espacio de trabajo',
        'Ideal para usuarios avanzados'
      ]
    };

    return benefits[featureKey] || [
      'Funcionalidad adicional',
      'Mejora tu experiencia',
      'Disponible tras la compra'
    ];
  }
}