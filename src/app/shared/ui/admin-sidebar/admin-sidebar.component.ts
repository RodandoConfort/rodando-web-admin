import { Component, inject, signal } from '@angular/core';

import { AdminLayoutStore } from '../../../core/store/ui/admin-layout.store';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatListModule, MatNavList } from "@angular/material/list";

import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [MatToolbar,
    MatIcon,
    MatNavList,
    NgFor,
    RouterLink,
    RouterLinkActive,
    MatListModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

  uiStore = inject(AdminLayoutStore);

  transportOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/inicio' },
    { label: 'Usuarios', icon: 'group', link: '/users' },
    {
      label: 'Vehiculos',
      icon: 'local_shipping',
      children: [
        {
          label: 'Categorías',
          icon: 'category',
          link: '/vehicles_categories',
        },
        {
          label: 'Clases',
          icon: 'rule',
          link: '/vehicles/service-classes',
        },
        {
          label: 'Tipos',
          icon: 'directions_car',
          link: '/vehicles',
        },
        {
          label: 'Listado',
          icon: 'directions_car',
          link: '/vehicles',
        },
      ],
    },
    { label: 'Reportes', icon: 'bar_chart', link: '/reports' },
    { label: 'Ajustes', icon: 'settings', link: '/settings' },
  ];

   toggleTransport(event?: MouseEvent): void {
    // Para que no dispare onNavItemClick si haces click en el grupo
    event?.stopPropagation();
    this.transportOpen.update(open => !open);
  }

  onNavItemClick(): void {
    if (this.uiStore.isHandset()) {
      this.uiStore.closeSidebar();
    }
  }
}
