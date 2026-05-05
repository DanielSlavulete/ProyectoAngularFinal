import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface OrderItem {
  id: string;
  order_id: string;
  plan_id: string;
  quantity: number;
  unit_price: string;
  plan: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    feature_key: string;
  } | null;
}

export interface Order {
  id: string;
  user_id: string;
  total: string;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
}

interface OrderResponse {
  order: Order;
}

interface CreateOrderItemData {
  planId: number;
  quantity: number;
}

interface CreateOrderData {
  items: CreateOrderItemData[];
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/orders';

  createOrder(data: CreateOrderData) {
    return this.http.post<OrderResponse>(this.apiUrl, data);
  }

  getOrders() {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  getOrder(id: string) {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }
}