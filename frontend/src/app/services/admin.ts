import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface AdminStats {
  usersCount: number;
  boardsCount: number;
  notesCount: number;
  ordersCount: number;
  activePlansCount: number;
  totalRevenue: string;
}

export interface AdminUser {
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

export interface AdminBoard {
  id: string;
  title: string;
  description: string | null;
  color: string;
  background_theme: string;
  owner_id: string;
  owner: {
    id: string;
    name: string;
    email: string;
  } | null;
  notes_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  total: string;
  status: string;
  payment_method: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminPlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  feature_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminStatsResponse {
  stats: AdminStats;
}

interface AdminUsersResponse {
  users: AdminUser[];
}

interface AdminBoardsResponse {
  boards: AdminBoard[];
}

interface AdminOrdersResponse {
  orders: AdminOrder[];
}

interface AdminPlansResponse {
  plans: AdminPlan[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin';

  getStats() {
    return this.http.get<AdminStatsResponse>(`${this.apiUrl}/stats`);
  }

  getUsers() {
    return this.http.get<AdminUsersResponse>(`${this.apiUrl}/users`);
  }

  getBoards() {
    return this.http.get<AdminBoardsResponse>(`${this.apiUrl}/boards`);
  }

  getOrders() {
    return this.http.get<AdminOrdersResponse>(`${this.apiUrl}/orders`);
  }

  getPlans() {
    return this.http.get<AdminPlansResponse>(`${this.apiUrl}/plans`);
  }
}