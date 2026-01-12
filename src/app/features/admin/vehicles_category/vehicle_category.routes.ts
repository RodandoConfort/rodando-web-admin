import { Routes } from '@angular/router';

export default [
    {
        path: 'list',
        loadComponent: () => import('./pages/vehicle-category-list/vehicle-category-list.component'),
    },
    {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full'
    },

] as Routes;