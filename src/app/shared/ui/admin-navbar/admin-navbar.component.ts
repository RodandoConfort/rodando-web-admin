import { Component, inject } from '@angular/core';

import { AdminLayoutStore } from '../../../core/store/ui/admin-layout.store';

import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [MatToolbar, MatIcon],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent {

   private uiStore = inject(AdminLayoutStore);

  toggleSidebar(): void {
    this.uiStore.toggleSidebar();
  }
}
