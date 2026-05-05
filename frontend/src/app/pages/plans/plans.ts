import { Component, inject, OnInit, signal } from '@angular/core';
import { Cart } from '../../services/cart';
import { PlanService, Plan } from '../../services/plan';

// Extendemos el modelo Plan que viene del backend con datos solo visuales.
// Estos campos no están en Supabase, los añadimos en Angular para pintar mejor la tarjeta.
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

  // Signals para gestionar el estado reactivo de la página.
  // plans guarda los planes reales del backend enriquecidos con tag y benefits.
  plans = signal<PlanView[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Carga los planes activos desde el backend.
    // La petición pasa por el interceptor, que añade el token JWT automáticamente.
    this.planService.getPlans().subscribe({
      next: (response) => {
        // Los datos base vienen de Supabase, pero añadimos información visual
        // según el feature_key para no tener que guardar esos textos en la BD.
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
    // Añade el plan seleccionado al carrito global.
    // Convertimos id y price porque desde el backend llegan como string.
    this.cart.addItem({
      id: Number(plan.id),
      name: plan.name,
      price: Number(plan.price),
      featureKey: plan.feature_key
    });
  }

  isInCart(planId: string): boolean {
    // Comprueba si un plan ya está en el carrito para desactivar el botón.
    return this.cart.items().some(item => item.id === Number(planId));
  }

  private getPlanTag(featureKey: string): string {
    // Traduce el feature_key técnico a una etiqueta entendible para el usuario.
    const tags: Record<string, string> = {
      PREMIUM_COLORS: 'Personalización',
      BACKGROUND_THEMES: 'Diseño',
      BOARD_LIMIT_12: 'Productividad'
    };

    return tags[featureKey] || 'Extra';
  }

  private getPlanBenefits(featureKey: string): string[] {
//Descripciones para no sobrecargar supabse
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