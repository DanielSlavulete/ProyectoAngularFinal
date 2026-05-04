import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

type Role = 'USER' | 'ADMIN';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string | null;
  name_color?: string | null;
  name_badge?: string | null;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000/api/auth';

  private userSignal = signal<AuthUser | null>(this.getStoredUser());

  user = this.userSignal.asReadonly();

  register(data: RegisterData) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  me() {
    return this.http.get<{ user: AuthUser }>(`${this.apiUrl}/me`);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.userSignal.set(response.user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && this.userSignal() !== null;
  }

  isAdmin(): boolean {
    return this.userSignal()?.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }
}