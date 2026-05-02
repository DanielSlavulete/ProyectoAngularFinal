import { Component } from '@angular/core';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  boardsCount: number;
  plansCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-users',
  imports: [],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers {
  users: AdminUser[] = [
    {
      id: 1,
      name: 'Daniel Slavulete',
      email: 'daniel@test.com',
      role: 'USER',
      boardsCount: 3,
      plansCount: 2,
      createdAt: '02/05/2026'
    },
    {
      id: 2,
      name: 'Admin Test',
      email: 'admin@test.com',
      role: 'ADMIN',
      boardsCount: 0,
      plansCount: 0,
      createdAt: '02/05/2026'
    },
    {
      id: 3,
      name: 'Laura Pérez',
      email: 'laura@test.com',
      role: 'USER',
      boardsCount: 5,
      plansCount: 1,
      createdAt: '03/05/2026'
    }
  ];
}