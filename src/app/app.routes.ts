import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        // canMatch: [authCanMatchGuard],   // o CanActivate si prefieres
        children: [
            {
                path: 'inicio',
                pathMatch: 'full',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component')
                    .then(m => m.DashboardComponent),
            },
            // {
            //     path: 'users',
            //     loadChildren: () => import('./features/admin/users/users.routes')
            //         .then(m => m.USERS_ROUTES),
            // },
            {
                path: 'vehicles_categories',
                loadChildren: () => import('./features/admin/vehicles_category/vehicle_category.routes')
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
