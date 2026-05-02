import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

type Role = 'USER' | 'ADMIN';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private router = inject(Router);

  private userSignal = signal<AuthUser | null>(null);

  user = this.userSignal.asReadonly();

  isLoggedIn(): boolean {
    return this.userSignal() !== null;
  }

  isAdmin(): boolean {
    return this.userSignal()?.role === 'ADMIN';
  }

  loginAsUser(): void {
    this.userSignal.set({
      id: 1,
      name: 'Daniel',
      email: 'daniel@test.com',
      role: 'USER'
    });

    this.router.navigate(['/home']);
  }

  loginAsAdmin(): void {
    this.userSignal.set({
      id: 99,
      name: 'Admin',
      email: 'admin@test.com',
      role: 'ADMIN'
    });

    this.router.navigate(['/admin/dashboard']);
  }

  logout(): void {
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}