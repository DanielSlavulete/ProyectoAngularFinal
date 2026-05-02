import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

//Rutas acceso usuarios

import { Login } from './pages/login/login';
import { UserOrders } from './pages/user-orders/user-orders';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { Plans } from './pages/plans/plans';
import { Home } from './pages/home/home';
import { Checkout } from './pages/checkout/checkout';
import { Cart } from './pages/cart/cart';
import { BoardDetails } from './pages/board-details/board-details';

//Rutas de admoinistradores
import { AdminBoards } from './pages/admin/admin-boards/admin-boards';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminOrders } from './pages/admin/admin-orders/admin-orders';
import { AdminPlans } from './pages/admin/admin-plans/admin-plans';
import { AdminUsers } from './pages/admin/admin-users/admin-users';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    { path: 'register', component: Register },

    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'boards/:id', component: BoardDetails, canActivate: [authGuard] },
    { path: 'plans', component: Plans, canActivate: [authGuard] },
    { path: 'cart', component: Cart, canActivate: [authGuard] },
    { path: 'checkout', component: Checkout, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'profile/orders', component: UserOrders, canActivate: [authGuard] },

    {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: AdminDashboard },
        { path: 'users', component: AdminUsers },
        { path: 'boards', component: AdminBoards },
        { path: 'orders', component: AdminOrders },
        { path: 'plans', component: AdminPlans },
    ],
    },

    { path: '**', redirectTo: 'home' },
];
