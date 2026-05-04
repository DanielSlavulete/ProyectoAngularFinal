import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  feature_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PlansResponse {
  plans: Plan[];
}

interface PlanResponse {
  plan: Plan;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/plans';

  getPlans() {
    return this.http.get<PlansResponse>(this.apiUrl);
  }

  getPlan(id: string) {
    return this.http.get<PlanResponse>(`${this.apiUrl}/${id}`);
  }
}