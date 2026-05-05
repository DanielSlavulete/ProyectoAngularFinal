import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  name_color: string | null;
  name_badge: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  order_id: string;
  purchased_at: string;
  plan: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    feature_key: string;
    is_active: boolean;
  };
}

interface UserResponse {
  user: UserProfile;
}

interface UserPlansResponse {
  plans: UserPlan[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/users';

  getMe() {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`);
  }

  getMyPlans() {
    return this.http.get<UserPlansResponse>(`${this.apiUrl}/me/plans`);
  }
}