import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { FurnitureListComponent } from './pages/furniture/furniture-list.component';
import { CartComponent } from './pages/cart/cart.component';
import { RegisterAdminComponent } from './pages/auth/register-admin.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'furniture',
    component: FurnitureListComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'auth/register-admin',
    component: RegisterAdminComponent
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
